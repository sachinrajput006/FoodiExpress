import requests

url = "http://127.0.0.1:8000/accounts/login/"
data = {
    "email": "test@example.com",
    "password": "admin"
}

response = requests.post(url, json=data)
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
