import os
import datetime
import jwt
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from backend.database import (
    init_db, register_user, get_user_by_email, get_user_by_id,
    save_prediction, get_predictions, get_prediction_by_id, get_predictions_statistics
)
from backend.model_utils import get_prediction
from backend.pdf_generator import generate_pdf_report

app = Flask(__name__)
CORS(app) # Allow frontend to communicate with API endpoints

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'agri_guard_super_secret_key_2026')
app.config['UPLOAD_FOLDER'] = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
    'uploads'
)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16MB max upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Ensure upload and template directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
templates_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
os.makedirs(templates_folder, exist_ok=True)

# Initialize database tables
with app.app_context():
    init_db()

@app.route('/')
def serve_home():
    return send_from_directory(templates_folder, 'index.html')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Read Authorization header: "Bearer <token>"
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Authentication token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = get_user_by_id(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Invalid user account!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# AUTH ROUTES
@app.route('/api/auth/register', methods=['POST'])
def signup():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'message': 'All fields (username, email, password) are required!'}), 400
        
    # Check if user already exists
    existing = get_user_by_email(email)
    if existing:
        return jsonify({'message': 'User with this email already exists!'}), 409
        
    pw_hash = generate_password_hash(password)
    success = register_user(username, email, pw_hash)
    
    if success:
        return jsonify({'message': 'User registered successfully!'}), 201
    else:
        return jsonify({'message': 'Failed to register user. Database error.'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required!'}), 400
        
    user = get_user_by_email(email)
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'message': 'Invalid email or password!'}), 401
        
    # Generate JWT
    token_payload = {
        'user_id': user['id'],
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }
    
    token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm='HS256')
    # PyJWT returns string in modern versions, but handle bytes just in case
    if isinstance(token, bytes):
        token = token.decode('utf-8')
        
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email']
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify({
        'id': current_user['id'],
        'username': current_user['username'],
        'email': current_user['email']
    }), 200

# CROP PREDICTION ENDPOINT
@app.route('/api/predict', methods=['POST'])
@token_required
def predict(current_user):
    # Check if file part exists
    if 'image' not in request.files:
        return jsonify({'message': 'No image file uploaded!'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'Empty filename uploaded!'}), 400
        
    if not allowed_file(file.filename):
        return jsonify({'message': 'Invalid file format! Allowed types: PNG, JPG, JPEG.'}), 400
        
    try:
        # Secure and save file
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = f"user{current_user['id']}_{timestamp}_{secure_filename(file.filename)}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_name)
        file.save(file_path)
        
        # Perform disease prediction
        result = get_prediction(file_path)
        
        # Save to database
        pred_id = save_prediction(
            user_id=current_user['id'],
            crop_name=result['crop_name'],
            disease_name=result['disease_name'],
            confidence=result['confidence'],
            status=result['status'],
            image_path=safe_name # Store filename, not absolute path for portability
        )
        
        result['id'] = pred_id
        result['image_url'] = f"/uploads/{safe_name}"
        result['created_at'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error handling upload/prediction: {e}")
        return jsonify({'message': f'Prediction system error: {str(e)}'}), 500

# USER PREDICTION HISTORY
@app.route('/api/history', methods=['GET'])
@token_required
def history(current_user):
    records = get_predictions(current_user['id'])
    # Append visual URLs
    for rec in records:
        rec['image_url'] = f"/uploads/{rec['image_path']}"
    return jsonify(records), 200

# DASHBOARD STATISTICS
@app.route('/api/stats', methods=['GET'])
@token_required
def stats(current_user):
    statistics = get_predictions_statistics(current_user['id'])
    return jsonify(statistics), 200

# DOWNLOADABLE PDF REPORT
@app.route('/api/report/<int:prediction_id>', methods=['GET'])
def download_report(prediction_id):
    # Fetch prediction
    pred = get_prediction_by_id(prediction_id)
    if not pred:
        return jsonify({'message': 'Report not found!'}), 404
        
    # Get full details from local dictionary since database only holds core elements
    from backend.disease_data import get_disease_info
    # Reconstruct class_name from crop and disease name
    class_name = f"{pred['crop_name']}___{pred['disease_name'].replace(' ', '_')}"
    # Edge case correction for "Healthy Leaf" class naming mapping
    if pred['disease_name'] == "Healthy Leaf":
        class_name = f"{pred['crop_name']}___Healthy"
        
    info = get_disease_info(class_name)
    
    # Complete prediction dictionary for PDF generator
    full_pred = {
        **pred,
        "symptoms": info["symptoms"],
        "causes": info["causes"],
        "treatment": info["treatment"],
        "prevention": info["prevention"],
        # Resolve full local path of image for ReportLab to fetch
        "image_path": os.path.join(app.config['UPLOAD_FOLDER'], pred['image_path']),
        "prediction_method": "AgriGuard AI Assessment"
    }
    
    # Write to a unique PDF output path
    pdf_name = f"report_crop_diagnosis_{prediction_id}.pdf"
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_name)
    
    try:
        generate_pdf_report(full_pred, pdf_path)
        return send_file(pdf_path, as_attachment=True, download_name=pdf_name, mimetype='application/pdf')
    except Exception as e:
        print(f"Error compiling PDF: {e}")
        return jsonify({'message': f'Failed to compile PDF: {str(e)}'}), 500

# SERVE UPLOADS STATICALLY
@app.route('/uploads/<filename>', methods=['GET'])
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
