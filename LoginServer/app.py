from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import random
from twilio.rest import Client
import os
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load Twilio Account SID and Auth Token from environment variables
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

# Load MongoDB connection string from environment variable

client = MongoClient("127.0.0.1", port=27017)
db = client["users"]
collection = db["auths"]
doctors_collection=client["doctors"]["doc_auth"]


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    existing_doctor = doctors_collection.find_one({"email": data['email']})
    if existing_doctor:
        return jsonify({"success": False, "message": "Doctor already registered."}), 400
    
    unique_id = str(uuid.uuid4())[:8]  # Generate a unique 8-character ID
    doctor = {
        "name": data['name'],
        "email": data['email'],
        "phone": data['phone'],
        "specialty": data['specialty'],
        "password": data['password'],  # In production, hash this password
        "uniqueId": unique_id
    }
    
    doctors_collection.insert_one(doctor)  # Insert doctor into the collection
    return jsonify({"success": True, "uniqueId": unique_id}), 201

@app.route('/doctorlogin', methods=['POST'])
def doctorlogin():
    data = request.json
    doctor = doctors_collection.find_one({"uniqueId": data['uniqueId'], "password": data['password']})
    if doctor:
        return jsonify({"success": True, "doctor": doctor['name']}), 200
    else:
        return jsonify({"success": False, "message": "Invalid unique ID or password."}), 401

@app.route('/forgotid', methods=['POST'])
def forgot_id():
    data = request.json
    print("Received data:", data)  # Log incoming request
    doctor = doctors_collection.find_one({"name": data['name'], "phone": data['phone']})
    if doctor:
        print("Doctor found:", doctor)  # Log found doctor
        return jsonify({"success": True, "uniqueId": doctor['uniqueId']})
    else:
        print("Doctor not found")  # Log if doctor not found
        return jsonify({"success": False, "message": "Doctor not found."})

@app.route('/verify-patient', methods=['POST'])
def verify_patient():
    data=request.json
    patient = collection.find_one({"aadhaar": data['aadhaar'], "otp": int(data['otp'])})
    # patient = collection.find_one({"aadhaar": "1234-5678-9112","otp": 233782})
    print("PATIENT: ",patient)
    if patient:
        print("Patient found:", patient)  # Log found doctor
        return jsonify({"success": True, "uniqueId": patient['aadhaar']}),200
    else:
        print("Patient not found")  # Log if doctor not found
    return 404


# Helper function to generate OTP
def generate_otp():
    return random.randint(100000, 999999)

# Function to send OTP using Twilio
# Function to send OTP using Twilio
def send_otp(phone, otp):
    # Ensure the phone number includes the country code +91
    if not phone.startswith("+91"):
        phone = f"+91{phone}"

    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body=f"Your OTP is {otp}",
        from_=TWILIO_PHONE_NUMBER,
        to=phone
    )
    print(f"Sent OTP {otp} to {phone}: {message.sid}")


# Route for signup (step 1: collect details, send OTP)
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    aadhaar = data.get('aadhaar')
    phone = data.get('phone')
    name = data.get('name')
    password = data.get('password')

    # Check if user already exists based on Aadhaar number
    if collection.find_one({'aadhaar': aadhaar}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Generate OTP
    otp = generate_otp()

    # Send OTP to user's phone
    send_otp(phone, otp)

    # Save the user data with OTP to MongoDB
    user_data = {
        'aadhaar': aadhaar,
        'phone': phone,
        'name': name,
        'password': hashed_password,
        'otp': otp,  # Store OTP for verification
        'is_verified': False,  # Mark user as unverified until OTP is confirmed
        'files': []
    }
    collection.insert_one(user_data)

    return jsonify({"message": "OTP sent to phone number"}), 200

# Route to verify OTP for signup (step 2: verify OTP)
@app.route('/verify-signup-otp', methods=['POST'])
def verify_signup_otp():
    data = request.get_json()
    aadhaar = data.get('aadhaar')
    otp = data.get('otp')

    # Find the user in the database
    user = collection.find_one({'aadhaar': aadhaar})

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the OTP matches
    if str(user['otp']) == str(otp):
        collection.update_one({'aadhaar': aadhaar}, {'$set': {'is_verified': True}})
        return jsonify({"message": "User verified"}), 200
    else:
        return jsonify({"message": "Invalid OTP"}), 400

# Route for login (step 1: login with Aadhaar and password)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    aadhaar = data.get('aadhaar')
    password = data.get('password')

    # Find the user by Aadhaar
    user = collection.find_one({'aadhaar': aadhaar})

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the user is verified
    if not user['is_verified']:
        return jsonify({"message": "User is not verified"}), 400

    # Check if the password is correct
    if check_password_hash(user['password'], password):
        # Generate and send OTP for login
        otp = generate_otp()
        collection.update_one({'aadhaar': aadhaar}, {'$set': {'otp': otp}})
        send_otp(user['phone'], otp)
        
        # Save OTP in the database for verification during login
        
        return jsonify({"message": "OTP sent for login verification"}), 200
    else:
        return jsonify({"message": "Incorrect password"}), 400

# Route to verify OTP during login (step 2: verify OTP after login)
@app.route('/verify-login-otp', methods=['POST'])
def verify_login_otp():
    data = request.get_json()
    aadhaar = data.get('aadhaar')
    otp = data.get('otp')

    # Find the user in the database
    user = collection.find_one({'aadhaar': aadhaar})

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the OTP matches the one sent during login
    if str(user.get('otp', '')) == str(otp):
        return jsonify({"message": "Login successful, Hello, world!"}), 200
    else:
        return jsonify({"message": "Invalid OTP"}), 400

# Route to test if the backend is working
@app.route('/')
def hello():
    return "Hello, world!"

if __name__ == '__main__':
    app.run(debug=True, port=5050)