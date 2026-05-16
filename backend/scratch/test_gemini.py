import urllib.request
import json

API_KEY = 'AIzaSyDsPwBWXLZ2wFWVKKXbVCa8vyaEWq8UhkU'
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}'

payload = json.dumps({
    "contents": [{
        "parts": [{
            "text": "Hello"
        }]
    }]
}).encode('utf-8')

req = urllib.request.Request(API_URL, data=payload, headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.status)
        print("Response JSON:", json.loads(response.read().decode('utf-8')))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Error JSON:", json.loads(e.read().decode('utf-8')))
