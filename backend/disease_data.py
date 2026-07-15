# Comprehensive Crop Disease Database
# Contains symptoms, causes, treatments, and prevention tips for supported crops and diseases.

DISEASE_DATABASE = {
    "Tomato___Healthy": {
        "crop_name": "Tomato",
        "disease_name": "Healthy Leaf",
        "status": "Healthy",
        "symptoms": "Leaf is vibrant green with no spots, yellowing, wilting, or structural deformities.",
        "causes": "Optimal environmental conditions, adequate nutrient balance, and proper watering schedule.",
        "treatment": "No treatment required. Continue monitoring and maintaining current gardening/farming practices.",
        "prevention": "Ensure clean watering techniques, avoid splashing soil onto leaves, and rotate crops annually."
    },
    "Tomato___Early_Blight": {
        "crop_name": "Tomato",
        "disease_name": "Early Blight",
        "status": "Diseased",
        "symptoms": "Dark brown or black spots with concentric rings (target-like pattern) forming first on older, lower leaves. Affected leaves may turn yellow and drop off.",
        "causes": "Alternaria solani fungus, which thrives in warm, humid weather and spreads via splashing water and wind.",
        "treatment": "Prune infected lower branches to improve airflow. Apply copper-based fungicides or bio-fungicides containing Bacillus subtilis.",
        "prevention": "Practice crop rotation (avoid planting nightshades in the same soil for 3 years). Use drip irrigation to keep foliage dry. Apply mulch to prevent soil spores from splashing up."
    },
    "Tomato___Late_Blight": {
        "crop_name": "Tomato",
        "disease_name": "Late Blight",
        "status": "Diseased",
        "symptoms": "Large, irregular water-soaked spots that rapidly turn dark brown to black. In humid conditions, a fine white velvety mold growth appears on the undersides of leaves. Stems also develop dark lesions.",
        "causes": "Phytophthora infestans (an oomycete or water mold) that spreads rapidly in cool, wet, and humid conditions.",
        "treatment": "No cure once widespread. Immediately remove and destroy (do not compost) affected plants. Apply preventative chlorothalonil or copper fungicides to nearby healthy plants.",
        "prevention": "Plant resistant cultivars. Keep foliage dry, water from the base, space plants adequately to ensure fast drying, and destroy any volunteer potato or tomato plants in spring."
    },
    "Tomato___Leaf_Mold": {
        "crop_name": "Tomato",
        "disease_name": "Leaf Mold",
        "status": "Diseased",
        "symptoms": "Pale green or yellowish spots on the upper surface of older leaves, followed by a light gray to olive-green velvety mold growth on the lower surface. Leaves roll up, wither, and drop.",
        "causes": "Passalora fulva fungus, which is favored by high humidity (greater than 85%) and moderate temperatures.",
        "treatment": "Improve greenhouse/garden ventilation and spacing. Apply liquid copper fungicides at the first sign of symptoms.",
        "prevention": "Grow resistant varieties. Keep greenhouse humidity low. Prune lower suckers to optimize air circulation and ensure plants dry quickly."
    },
    "Potato___Healthy": {
        "crop_name": "Potato",
        "disease_name": "Healthy Leaf",
        "status": "Healthy",
        "symptoms": "Uniform green foliage, firm stems, and leaves free from spotting, blight, or curling.",
        "causes": "Balanced soil nutrition, correct watering, and disease-free certified seed tubers.",
        "treatment": "No treatment required. Maintain proper soil moisture and monitor for pests.",
        "prevention": "Always use certified disease-free seed tubers. Keep soil well-drained and avoid overhead watering."
    },
    "Potato___Early_Blight": {
        "crop_name": "Potato",
        "disease_name": "Early Blight",
        "status": "Diseased",
        "symptoms": "Concentric rings (target pattern) forming dark brown, dry spots on older leaves. Spots are usually bound by major leaf veins. Yield can be heavily reduced if it spreads early.",
        "causes": "Alternaria solani fungus, persisting in infected crop residue in the soil and spreading under warm, alternating wet-and-dry conditions.",
        "treatment": "Apply protectant fungicides (chlorothalonil, mancozeb) or systemic fungicides. Keep plants healthy with balanced nitrogen fertilization.",
        "prevention": "Rotate crops with non-susceptible plants. Harvest on time, remove or deeply plow crop debris after harvest, and optimize watering using drip irrigation."
    },
    "Potato___Late_Blight": {
        "crop_name": "Potato",
        "disease_name": "Late Blight",
        "status": "Diseased",
        "symptoms": "Dark green to purplish-black water-soaked lesions on leaves and stems. Under high humidity, white downy mold grows on leaf undersides. Entire plants can rot and die within days.",
        "causes": "Phytophthora infestans. Infamous pathogen that caused the Irish Potato Famine; spreads rapidly in cool, rainy weather.",
        "treatment": "Immediately destroy infected plants. Spray surrounding plants with protectant or systemic fungicides (mefenoxam or copper) to limit spread.",
        "prevention": "Destroy cull piles (volunteer potato waste). Use certified clean seed tubers. Keep rows well-hilled to prevent spores from washing down into the tubers."
    },
    "Corn___Healthy": {
        "crop_name": "Corn",
        "disease_name": "Healthy Leaf",
        "status": "Healthy",
        "symptoms": "Strong, broad green leaves with distinct parallel veins, free from spots, rust pustules, or streaks.",
        "causes": "Excellent soil nitrogen level, full sunlight exposure, and disease-resistant hybrid seed selection.",
        "treatment": "No treatment required. Continue monitoring and provide adequate watering during pollination.",
        "prevention": "Use high-yielding, disease-resistant hybrids and ensure balanced soil fertilization."
    },
    "Corn___Common_Rust": {
        "crop_name": "Corn",
        "disease_name": "Common Rust",
        "status": "Diseased",
        "symptoms": "Golden-brown to cinnamon-brown powdery pustules (spots) on both the upper and lower surfaces of leaves. Pustules rupture, releasing reddish-brown fungal spores.",
        "causes": "Puccinia sorghi fungus. Spores are blown by wind from southern regions and thrive in high humidity and cool temperatures (16-22°C).",
        "treatment": "Apply foliar fungicides (strobilurins, triazoles) if symptoms appear before silking and weather is favorable for disease.",
        "prevention": "Plant resistant hybrid varieties. Practice conservation tillage to bury crop debris, although wind-blown spores are the primary infection source."
    },
    "Corn___Northern_Leaf_Blight": {
        "crop_name": "Corn",
        "disease_name": "Northern Leaf Blight",
        "status": "Diseased",
        "symptoms": "Long, elliptical, grayish-green or tan lesions (often described as cigar-shaped) on leaves, starting from the lower leaves and progressing upwards. Can merge to kill large areas of the leaf.",
        "causes": "Exserohilum turcicum fungus, which overwinters in corn debris. Spreads during warm, wet, and humid conditions with heavy dew.",
        "treatment": "Apply labeled fungicides if the disease progresses on the upper leaves before pollination.",
        "prevention": "Rotate crops away from corn for at least 1 year. Manage residue by tillage to reduce overwintering spore loads. Select resistant hybrids."
    },
    "Apple___Healthy": {
        "crop_name": "Apple",
        "disease_name": "Healthy Leaf",
        "status": "Healthy",
        "symptoms": "Sleek, firm, deep green leaves without spots, orange lesions, or powdery coatings.",
        "causes": "Good orchard hygiene, balanced watering, and regular spring pruning.",
        "treatment": "No action needed. Focus on tree maintenance and fruit thinning.",
        "prevention": "Keep the orchard floor clear of fallen leaves and perform routine pruning to allow sunlight into the canopy."
    },
    "Apple___Apple_Scab": {
        "crop_name": "Apple",
        "disease_name": "Apple Scab",
        "status": "Diseased",
        "symptoms": "Olive-green, velvety, circular spots on leaves that turn brown or black over time. Leaves may warp, turn yellow, and drop prematurely. Fruit develops scabby, corky brown spots.",
        "causes": "Venturia inaequalis fungus, which overwinters in fallen leaves on the orchard floor and releases spores during spring rains.",
        "treatment": "Spray lime-sulfur or standard copper fungicides during early bud break and petall-fall phases. Prune to improve air flow.",
        "prevention": "Rake and destroy or bury fallen apple leaves in autumn to reduce spring spore load. Plant resistant varieties like 'Liberty' or 'Freedom'."
    },
    "Apple___Cedar_Apple_Rust": {
        "crop_name": "Apple",
        "disease_name": "Cedar Apple Rust",
        "status": "Diseased",
        "symptoms": "Bright orange or yellow spots on the upper leaf surface in early summer. Small, tube-like projections (aecia) appear on the lower leaf surface underneath the spots.",
        "causes": "Gymnosporangium juniperi-virginianae, a rust fungus that requires two hosts (apple trees and red cedar/juniper trees) to complete its lifecycle.",
        "treatment": "Apply copper or preventative fungicides (myclobutanil) starting at the pink bud stage through late spring.",
        "prevention": "Avoid planting apple trees near red cedars (junipers) within a 1-2 mile radius if possible. Remove rust galls from nearby cedar trees in late winter."
    }
}

# List of all classes in alphabetical order matching model outputs
DISEASE_CLASSES = sorted(list(DISEASE_DATABASE.keys()))

def get_disease_info(class_name):
    """
    Returns disease information given the class name.
    Falls back to a default value if class_name not found.
    """
    return DISEASE_DATABASE.get(class_name, {
        "crop_name": "Unknown",
        "disease_name": "Unknown Condition",
        "status": "Unknown",
        "symptoms": "No information available.",
        "causes": "No information available.",
        "treatment": "No information available.",
        "prevention": "No information available."
    })
