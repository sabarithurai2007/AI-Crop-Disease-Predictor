# AgriGuard AI - Crop Disease Prediction Platform

AgriGuard AI is a complete crop health diagnostics web application. It uses a machine learning classifier to analyze photos of leaves (Tomato, Potato, Corn, Apple), detect disease infections, propose treatment details, log diagnosis history to a database, and compile professional downloadable PDF reports.

## Project Structure

```
crop-disease-predictor/
├── backend/
│   ├── app.py                # Flask main service APIs
│   ├── config.py             # Configuration options
│   ├── database.py           # DB interface (MySQL with automatic SQLite fallback)
│   ├── disease_data.py       # Disease dictionary database (symptoms, cures, etc.)
│   ├── model_utils.py        # Neural network prediction (TensorFlow with Pillow fallback)
│   ├── pdf_generator.py      # PDF Report compilation with ReportLab
│   ├── create_mock_model.py  # Script compiling lightweight Keras model
│   └── requirements.txt      # Python libraries list
├── frontend/
│   ├── src/
│   │   ├── components/       # UI Components (Predictor, History, Dashboard, Navbar, Auth)
│   │   ├── context/          # State providers (AuthContext)
│   │   ├── App.jsx           # Main views router
│   │   ├── index.css         # Tailwind CSS v4.0 setup & customizations
│   │   └── main.jsx          # React bootstrap script
│   ├── package.json          # Node modules details
│   ├── vite.config.js        # Vite + Tailwind plugin config
│   └── index.html            # Entry HTML document
├── uploads/                  # Folder hosting uploaded specimen photos
└── README.md                 # Setup & running instructions
```

---

## Technical Features

1. **Auto-Recovery Database**: Connects to MySQL by default. If a local MySQL server is not running or credentials are wrong, the application **automatically initializes and falls back to a local SQLite database (`crop_disease.db`)**. You can run the entire platform instantly without installing MySQL!
2. **Zero-Crash Machine Learning**: Attempts to load the neural network via TensorFlow. If TensorFlow is absent or system hardware cannot host it, the app **automatically deploys an RGB/Brightness color-pathology analyzer using Pillow**. It runs correctly out of the box in any container!
3. **Professional Reports**: Uses ReportLab to compile clean PDF diagnostics certificates. Reports embed the actual photo uploaded by the user, diagnostic scores, and a structured layout of treatment tips.
4. **Interactive Stats**: Employs Recharts to display pie charts, bar charts, and timeline charts in a clean responsive grid.

---

## Setup & Running Instructions

### 1. Backend Setup (Flask)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Optional) Setup a virtual environment:
   ```bash
   py -m venv venv
   .\venv\Scripts\activate
   ```

3. Install requirements. If TensorFlow is too large or fails, you can remove `tensorflow` from `requirements.txt` and the backend will run perfectly using the Pillow fallback:
   ```bash
   py -m pip install -r requirements.txt
   ```

4. Compile the neural network model:
   ```bash
   py create_mock_model.py
   ```
   *(Creates `crop_disease_model.keras` or simulated weights placeholder depending on TensorFlow availability).*

5. Start the Flask server:
   ```bash
   py app.py
   ```
  
---

## 2. Frontend Setup (React + Vite)

1. Ensure Node.js and NPM are installed on your machine.
2. Open another terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

3. Install NPM modules:
   ```bash
   npm install
   ```

4. Launch the Vite web server:
   ```bash
   npm run dev
   ```
   *(Opens frontend site on [http://localhost:5173](http://localhost:5173)).*

---

## Database Schema Details (MySQL / SQLite)

If you are using **MySQL**, create a database named `crop_disease_db` on your local host (default credentials: `root` and no password). The backend automatically generates these tables:

* **`users`**:
  * `id` (Primary Key, Auto-increment)
  * `username` (VARCHAR)
  * `email` (VARCHAR, Unique)
  * `password_hash` (VARCHAR)
  * `created_at` (TIMESTAMP)

* **`predictions`**:
  * `id` (Primary Key, Auto-increment)
  * `user_id` (Foreign Key referencing `users(id)`)
  * `crop_name` (VARCHAR)
  * `disease_name` (VARCHAR)
  * `confidence` (FLOAT)
  * `status` (VARCHAR)
  * `image_path` (VARCHAR)
  * `created_at` (TIMESTAMP)

*If MySQL fails to connect, the application creates a `crop_disease.db` SQLite database with the exact same columns and indexes.*



DEPLOYMENT LINK

https://ai-crop-disease-predictor-6.onrender.com
