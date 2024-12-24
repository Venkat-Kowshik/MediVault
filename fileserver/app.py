from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad,unpad
import base64
import time
import gridfs
from pymongo import MongoClient
from datetime import datetime
from pathlib import Path
import uuid
import google.generativeai as genai

genai.configure(api_key="")
model = genai.GenerativeModel("gemini-1.5-flash")
# response = model.generate_content("Explain how AI works")
# print(response.text)



# mongo_uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5"
# client = MongoClient(mongo_uri)  # Change to your MongoDB URI
# db = client["hello"]
# fs = gridfs.GridFS(db)
app = Flask(__name__)
CORS(app, origins=["*"])

@app.route('/getinsights',methods=['GET'])
def generate_insights() -> str:
    # text = "Hemoglobin Values(g/dL): 12.4,13.4,14.9,16,17.4,16"
    text = request.args.get('text')
    # models = [m for m in palm.list_models() if 'generateText' in m.supported_generation_methods]
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"(Assume 30 year old male and data is recorded across 2 months. Also assume any other required details. Only give the response in plain text and do not use any formattings (like *)) Analyze the given medical report data and provide a summary with key medical insights, personal health recommendations, and suggestions for precautions based on the findings. Keep the medical report's findings in context while offering relevant and practical advice for maintaining or improving health.\n {text}"



    completion = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            top_p=0.95,
            top_k=40,
            max_output_tokens=1024
        ),
    )
    # completion = model.generate_text(
    #     model=model,
    #     prompt=prompt,
    #     temperature=0.7,
    #     top_p=0.95,
    #     top_k=40,
    #     max_output_tokens=1024,
    # )

    # content = completion.result
    # content = content.encode().decode('unicode_escape')
    # title = content.split('\n')[0]
    # title = title.replace('Title: ', '')
    # story = content[content.find('\n'):]
    # story = story.lstrip()
    print(completion.text)
    return jsonify({"reply": completion.text}), 200

# print(generate_insights("Hemoglobin Values(g/dL): 12.4,13.4,14.9,16,17.4,16"))
@app.route('/hello',methods=['GET'])
def hello():
    return "hello there"

@app.route('/upload',methods=['POST'])
def receive_file():
    rcvfile=request.files.get("pdf")
    username=request.args.get("username")
    print(username)
    encrypt_and_store_file(rcvfile,rcvfile.filename,fs,encryption_key)
    add_file_to_user_doc(username,rcvfile.filename)
    return jsonify({'message': "result_text"}), 200

def add_file_to_user_doc(uname,filename):

    collection=db['users'].auths
    collection.update_one(
        {"aadhaar": uname},
        {"$addToSet": {"files": filename}}  # Use "$addToSet" to avoid duplicates
    )

@app.route('/getname',methods=['GET'])
def get_user_fname():
    aadharId=request.args.get("username")
    name=db['users'].auths.find_one({"aadhaar": aadharId})
    print("aaaaaaaa")
    print(name)
    return jsonify(name['name']),200

def mongo_conn():
    """create a connection"""
    try:
        conn = MongoClient("127.0.0.1", port=27017)
        print("Mongodb Connected", conn)
        return conn
    except Exception as err:
        print(f"Error in mongodb connection: {err}")


def encrypt_and_store_file(file_obj, file_name,fs, secret_key):
    cipher = AES.new(secret_key.encode("utf8"), AES.MODE_ECB)

    file_obj = file_obj.read()  # Read the content of the file

    # Encrypt and pad the content
    encrypted_bytes = cipher.encrypt(pad(file_obj, AES.block_size))

    # Encode to base64 to store as a string
    encrypted_base64 = base64.b64encode(encrypted_bytes).decode('utf-8')

    # three(encrypted_base64,file_name)
    # print(file_name)
    fs.put(encrypted_bytes,filename=file_name)
    

    print("Encrypted data and file metadata stored in MongoDB.")



def upload_file(file_obj, file_name, fs):
    """upload file to mongodb"""
    # with open(file_loc, 'rb') as file_data:
    #     data = file_data.read()
    data = file_obj.read()

    # print(file_loc.read())
    # # put file into mongodb
    fs.put(data, filename=file_name)
    print("Upload Complete")

@app.route("/download",methods=["GET"])
def download_file():
    """download file from mongodb"""
    cipher = AES.new(encryption_key.encode("utf8"), AES.MODE_ECB)

    filename = request.args.get('filename')
    fileobj= db['records'].files.files.find_one({"filename": filename})
    # for data in fileslist:
    fs_id = fileobj['_id']
    fname=fileobj['filename']
    # out_data = fs.get(fs_id).read()
    encrypted_bytes = fs.get(fs_id).read()
    decrypted_bytes = unpad(cipher.decrypt(encrypted_bytes), AES.block_size)

    print("saving file to "+os.path.join(download_loc+fname))
    with open(os.path.join(download_loc+fname), 'wb') as output:
        output.write(decrypted_bytes)


    print("Download Completed!")
    return send_file(os.path.join(download_loc+filename), as_attachment=False)
    # return "<!DOCTYPE html><html><body>hello</body></html>",200

@app.route('/filelist',methods=['GET'])
def getfilelist():
    # files=db.files.files.find()
    username=request.args.get("username")
    print(username)
    filesList=db['users'].auths.find_one({"aadhaar": username})['files']
    print(filesList)
    # otpt=[]
    # for data in filesList:
    #     otpt.append(data)
    
    # print(otpt)
    return jsonify(filesList),200





if __name__ == '__main__':
    db = mongo_conn()
    print(db)
    encryption_key = "mySuperSecretKey"
    fs = gridfs.GridFS(db['records'], collection="files")
    download_loc=os.path.join(os.getcwd() + "/downloads/")
    app.run(host='0.0.0.0', port=8000, debug=True)
    
