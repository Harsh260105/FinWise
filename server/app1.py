from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere
import json
import os

from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Set up Cohere API key

COHERE_API_KEY = "qfhMIPqUCPJCXmCmmCn9U2kG9Vc3vgrXH0P8rmtX"
co = cohere.Client(COHERE_API_KEY)

# File to store user investment history
HISTORY_FILE = "investment_history.json"


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
def get_ai_recommendation(user_input):
    """Generates investment recommendations using Cohere API."""
    prompt = f"""
    As a financial advisor, provide a detailed investment recommendation based on:
    
    User Profile:
    - Age: {user_input['age']} years
    - Gender: {user_input['gender']}
    - Income: ₹{user_input['income']} per year
    - Risk Tolerance: {user_input['riskTolerance']}
    - Investment Goals: {user_input['individualGoals']}
    - Financial Literacy: {user_input['financialLiteracy']}

    Provide recommendations in the following format:
    1. Recommended Investment Strategy
    2. Suggested Asset Allocation
    3. Specific Investment Products
    4. Risk Considerations
    5. Timeline Recommendations
    """

    try:
        response = co.chat(
            model="command-r",
            message=prompt,
            temperature=0.7,
            max_tokens=500
        )
        return response.text.strip()
    except Exception as e:
        print(f"Cohere API Error: {e}")
        return "Error generating recommendation. Please try again."


# API Endpoint: Get Investment Recommendation
@app.route('/predict_investment', methods=['POST'])
def predict_investment():

    try:
        data = request.json
        print("Received data:", data)  # Debug log

        # Validate required fields
        required_fields = ['age', 'gender', 'income', 'riskTolerance', 'individualGoals', 'financialLiteracy']
        if not all(field in data for field in required_fields):
            return jsonify({
                "success": False,
                "error": "Missing required fields",
                "required": required_fields
            }), 400

        # Get AI recommendation
        recommendation = get_ai_recommendation(data)

        # Save to history
        user_key = f"{data['age']}-{data['income']}-{data['riskTolerance']}"
        history = load_user_history()
        if user_key not in history:
            history[user_key] = []
        history[user_key].append({
            "timestamp": str(datetime.now()),
            "recommendation": recommendation
        })
        save_user_history(history)

        return jsonify({
            "success": True,
            "recommendation": recommendation
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "message": str(e)
        }), 500


# API Endpoint: Retrieve Past Recommendations
@app.route('/get_history', methods=['GET'])
def get_history():
    try:
        history = load_user_history()
        return jsonify({
            "success": True,
            "history": history
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Run Flask server
if __name__ == '__main__':
    app.run(debug=True, port=5000)



