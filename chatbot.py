from flask import Flask, request, jsonify, render_template
from difflib import get_close_matches
import json
import os

app = Flask(__name__)

RESPONSES_FILE = 'responses.json'

def load_responses():
    if os.path.exists(RESPONSES_FILE):
        try:
            with open(RESPONSES_FILE, 'r') as file:
                data = json.load(file)
                responses = {item['question']: item['answer'] for item in data.get('questions', [])}
                return responses
        except json.JSONDecodeError:
            print("Error: JSON file is corrupted or invalid.")
            return {}
        except Exception as e:
            print(f"Error reading JSON file: {e}")
            return {}
    return {}


def save_responses(responses):
    try:
        data = {'questions': [{'question': q, 'answer': a} for q, a in responses.items()]}
        with open(RESPONSES_FILE, 'w') as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        print(f"Error writing JSON file: {e}")


responses = load_responses()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')
    
    def get_best_response(user_input, responses):
        questions = list(responses.keys())
        closest_match = get_close_matches(user_input, questions, n=1)
        if closest_match:
            return responses.get(closest_match[0], "I don't understand that question.")
        return "I don't understand that question."
    response = get_best_response(user_input, responses)
    unknown = user_input not in responses and not get_close_matches(user_input, responses.keys(), n=1)
    return jsonify({'response': response, 'unknown': unknown})


if __name__ == '__main__':
    app.run(debug=True)
