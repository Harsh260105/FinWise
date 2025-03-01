from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Initialize Cohere API (Replace 'your-api-key' with your actual key)
COHERE_API_KEY = "qfhMIPqUCPJCXmCmmCn9U2kG9Vc3vgrXH0P8rmtX"
co = cohere.Client(COHERE_API_KEY)

@app.route('/get_advice', methods=['POST'])
def get_advice():
    try:
        data = request.json
        query = data.get("query", "").strip()

        if not query:
            return jsonify({"error": "No query provided"}), 400

        # Call Cohere API
        response = co.generate(
            model="command",
            prompt=query,
            max_tokens=300  # Adjust response length as needed
        )

        # Extract the AI response
        ai_response = response.generations[0].text.strip() if response.generations else "No response generated."

        return jsonify({"response": ai_response})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run on port 5000
