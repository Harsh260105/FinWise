from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere
import json
import os

# Initialize Flask app
app = Flask(_name_)
CORS(app)  # Enable CORS for frontend communication

# Set up Cohere API key (Replace 'your-api-key' with your actual key)
COHERE_API_KEY = "qfhMIPqUCPJCXmCmmCn9U2kG9Vc3vgrXH0P8rmtX"
co = cohere.Client(COHERE_API_KEY)

# File to store user investment history
HISTORY_FILE = "history.json"

# Load previous user history
def load_user_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as file:
            content = file.read().strip()  
            return json.loads(content) if content else {}  
    return {}

# Save updated history
def save_user_history(history):
    with open(HISTORY_FILE, "w") as file:
        json.dump(history, file, indent=4)

# AI Investment Recommendation Function
def get_ai_recommendation(user_input, past_data):
    """Generates investment recommendations using Cohere API and user history."""
    past_recommendations = "\n".join(
        [f"- {rec}" for rec in past_data]) if past_data else "No previous recommendations available."

    prompt = f"""
    You are a financial advisor. Based on the following user details, recommend an investment product:
    
    - Investment Goal: {user_input['Individual Goals']}
    - Age: {user_input['Age']}
    - Gender: {user_input['Gender']}
    - Risk Tolerance: {user_input['Risk Tolerance']}
    - Financial Literacy Level: {user_input['Financial Literacy']}
    - Income: {user_input['Income']}

    Past user investment preferences and recommendations:
    {past_recommendations}

    Provide both a primary recommendation and a diversified alternative.
    """

    response = co.chat(
        model="command-r",  
        message=prompt
    )

    return response.text.strip()

# API Endpoint: Get Investment Recommendation
@app.route('/predict_investment', methods=['POST'])
def predict_investment():
    """Receives user input, fetches AI recommendation, and updates history."""
    try:
        data = request.json
        user_history = load_user_history()

        # Validate user input
        required_fields = ["Individual Goals", "Age", "Gender", "Risk Tolerance", "Financial Literacy", "Income"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Generate unique key for user history
        user_key = f"{data['Age']}{data['Income']}{data['Risk Tolerance']}"
        past_recommendations = user_history.get(user_key, [])

        # Get AI recommendation
        recommendation = get_ai_recommendation(data, past_recommendations)

        # Update user history (store last 5 recommendations)
        user_history[user_key] = past_recommendations[-4:] + [recommendation]
        save_user_history(user_history)

        return jsonify({"recommendation": recommendation})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500

# API Endpoint: Retrieve Past Recommendations
@app.route('/get_history', methods=['GET'])
def get_history():
    """Fetch past investment recommendations for a user."""
    try:
        age = request.args.get("age")
        income = request.args.get("income")
        risk_tolerance = request.args.get("risk_tolerance")

        if not age or not income or not risk_tolerance:
            return jsonify({"error": "Missing required query parameters"}), 400

        user_key = f"{age}{income}{risk_tolerance}"
        user_history = load_user_history()

        past_recommendations = user_history.get(user_key, [])
        return jsonify({"history": past_recommendations})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500

# Run Flask server
if _name_ == '_main_':
    app.run(debug=True, port=5000)


Investment Recommendation backend code