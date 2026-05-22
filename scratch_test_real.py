import requests

url = "https://48caabce538a64.lhr.life/api/v1/payment/sepay-callback"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Apikey spsk_live_SHcAdLFTRFAQxy8xJqrNMYzNPiVPoJoC"
}

payload = {
    "transferType": "in",
    "code": "INV-20260521-005",
    "transferAmount": 49000
}

try:
    response = requests.post(url, headers=headers, json=payload)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
