import requests

def evaluate_quiz_with_gemini(quiz_name: str, user_answers: dict) -> dict:
    gemini_api_url = "https://gemini.googleapis.com/v1/evaluate"
    api_key = "YOUR_GEMINI_API_KEY"

    prompt = f"Evaluate the following answers for the '{quiz_name}' quiz. Provide a score (0-100) and feedback:\n"
    for qid, answer in user_answers.items():
        prompt += f"{qid}: {answer}\n"

    payload = {
        "prompt": prompt,
        "model": "gemini-1.0",
        "parameters": {
            "max_tokens": 256
        }
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    response = requests.post(gemini_api_url, json=payload, headers=headers)
    result = response.json()
    return {
        "score": result.get("score", None),
        "feedback": result.get("feedback", result.get("choices", [{}])[0].get("text", ""))
    }