from flask import Flask, request
from flask_restx import Api
from pymongo import MongoClient
import certifi

app = Flask(__name__, static_folder='./frontend/build', static_url_path='/')
rest_api = Api(version="1.0", title="Users API")

client = MongoClient("mongodb+srv://abigailhu2000:Abby2000325@cluster0.rbxf8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",tlsCAFile=certifi.where())
db = client.Final_Project
user_collection = db.Users
project_collection = db.Projects
hwsets_collection = db.HWSets
#test database connection
print("Here are a list of database connection!", db.list_collection_names())

@app.route('/')
def index():
    return app.send_static_file('index.html')

# login 
@app.route("/login", methods=['POST'])
def getServerResponse():
    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")


    if(not user_collection.find_one({"Username": username})):
        return {
            "success": False,
            "msg": "The user is not registered, please register first!"
        }, 200

    elif(not user_collection.find_one({"Username": username, "Password": password})):
        return {
            "success": False,
            "msg": "The user is registered but wrong password! Please enter the correct password."
        }, 200
    else:
        return {
            "success": True,
            "msg": "Logging in!"
        }, 200

 
@app.route("/register", methods=['POST'])
def registerUser():
    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")
    user = {
        "Username": username,
        "Password": password,
        "Project": []
    }
    user_id = user_collection.insert_one(user)
    print("The inserted user id is: ", user_id)
   
    return {"success": True}, 200



@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0')