import os
import base64
import datetime
import requests
from flask import Blueprint, request, jsonify
from config import db
from models import Payment, Booking

payments_bp = Blueprint('payments', __name__)

# helpers
def _get_mpesa_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    resp = requests.get(url, auth=(os.getenv("MPESA_CONSUMER_KEY"), os.getenv("MPESA_CONSUMER_SECRET")))
    return resp.json()["access_token"]

# routes
@payments_bp.route('/api/payments/initiate', methods=['POST'])
def initiate_stk():
    data   = request.json
    phone  = data["phone"]
    amount = data["amount"]
    name   = data.get("name", "User")
    booking_id = data["bookingId"]

    token = _get_mpesa_token()
    timestamp = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")
    password  = base64.b64encode(
        f"{os.getenv('MPESA_SHORTCODE')}{os.getenv('MPESA_PASSKEY')}{timestamp}".encode()
    ).decode()

    payload = {
        "BusinessShortCode": os.getenv("MPESA_SHORTCODE"),
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": os.getenv("MPESA_SHORTCODE"),
        "PhoneNumber": phone,
        "CallBackURL": os.getenv("CALLBACK_URL"),
        "AccountReference": str(booking_id),
        "TransactionDesc": f"Booking {booking_id}",
    }

    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers=headers,
    )

    # Save a stub record
    payment = Payment(booking_id=booking_id, amount=amount, status="PENDING")
    db.session.add(payment)
    db.session.commit()

    return jsonify({"success": True, "data": resp.json()}), 200


@payments_bp.route('/api/mpesa/callback', methods=['POST'])
def mpesa_callback():
    body = request.json.get("Body", {})
    stk = body.get("stkCallback", {})
    code = stk.get("ResultCode")
    items = stk.get("CallbackMetadata", {}).get("Item", [])
    booking_id = next((i["Value"] for i in items if i["Name"] == "AccountReference"), None)

    if code == 0 and booking_id:
        mpesa_code = next((i["Value"] for i in items if i["Name"] == "MpesaReceiptNumber"), None)
        Payment.query.filter_by(booking_id=int(booking_id)).update(
            {"status": "PAID", "mpesa_code": mpesa_code}
        )
        Booking.query.filter_by(id=int(booking_id)).update({"status": True})
        db.session.commit()

    return "", 200