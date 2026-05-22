import requests
import json

url = "http://localhost:8080/api/v1/payment/sepay-callback"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Apikey spsk_live_SHcAdLFTRFAQxy8xJqrNMYzNPiVPoJoC"
}
payload = {
    "transferType": "in",
    "code": "INV-20260521-003",
    "transferAmount": 79000
}

try:
    response = requests.post(url, headers=headers, json=payload)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
