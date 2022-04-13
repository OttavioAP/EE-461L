from flask import Flask, request, jsonify, Response, json
from flask_restx import Api
from pymongo import MongoClient
import certifi
from bson import json_util
import requests
from bs4 import BeautifulSoup
from bson.objectid import ObjectId

app = Flask(__name__, static_folder='./frontend/build', static_url_path='/')
rest_api = Api(version="1.0", title="Users API")

client = MongoClient("mongodb+srv://abigailhu2000:Abby2000325@cluster0.rbxf8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",tlsCAFile=certifi.where())
db = client.Final_Project
user_collection = db.Users
project_collection = db.Projects
hwsets_collection = db.HWSets
#test database connection
print("Here are a list of database connection!", db.list_collection_names())

#ascii shift value for our encryption / decryption
shift_value = 4

#encrypt given text
def encrypt(inputText):

    #Reverse the letters of the string
    reverse = inputText[::-1]      
    
    encrypted = ""
    
    for i in range(len(reverse)):  
        encrypted  += chr(ord(reverse[i]) + shift_value) #shift ascii by 'shift_value'
        
    return encrypted

#decrypt given encrypted text
def decrypt(encrypted):
    
    decrypted = ""
    
    for i in range(len(encrypted)):
        decrypted += chr(ord(encrypted[i]) - shift_value) #shift ascii by 'shift_value'

    decrypted = decrypted[::-1]
    
    return decrypted

@app.route('/')
def index():
    return app.send_static_file('index.html')

# login 
@app.route("/login", methods=['POST'])
def getServerResponse():
    request_data = request.get_json()
    username = encrypt(request_data.get("username"))
    password = encrypt(request_data.get("password"))


    if(not user_collection.find_one({"Username": username})):
        return {
            "success": False,
            "msg": "User not existed! The user is not registered, please register first!"
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
        "Username": encrypt(username),
        "Password": encrypt(password),
        "Project": []
    }
    user_id = user_collection.insert_one(user)
    print("The inserted user id is: ", user_id)
   
    return {"success": True}, 200

@app.route("/createproject", methods=['POST'])
def createProject():
    request_data = request.get_json()
    projectname = request_data.get("projectname")
    projectdescription = request_data.get("projectdescription")
    projectID = int(request_data.get("projectID"))
    project = {
        "projectname": projectname,
        "projectdescription": projectdescription,
        "projectID": projectID,
        "hwset1": 0,
        "hwset2": 0
    }
    project_id = project_collection.insert_one(project)
    print("The created project id is: ", project_id)
   
    return {"success": True}, 200

@app.route("/getAllProjects", methods=["GET"])
def getProjects():
    projects=[]
    for x in project_collection.find({}):
        print(x)
        projects.append(x)

    return {"projects": json.loads(json_util.dumps(projects))}, 200

@app.route("/getDatasets", methods=["GET"])
def getDatasets():
    five_datasets = []
    #URL = "https://physionet.org/about/database/"
    #page = requests.get(URL)
    #soup = BeautifulSoup(page.content, "html.parser")
    #datasets = soup.find_all("li")
    
    #for i in range(5):
    #    title = datasets[50+i].find("a", href=True, text=True)
    #    format_dataset = {
    #        "name": title.text.strip(),
    #        "url": "https://physionet.org"+title['href'],
    #        "metadata": datasets[50+i].text.strip()
    #    }
    #    five_datasets.append(format_dataset)

    url = 'https://physionet.org/about/database/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text)
 
    data_url = []
    i = 0
    #extract all the URLs found within a page’s <a> tags
    for link in soup.find_all('a'):
        if i in range(15, 22):
            if i == 18 or i == 19:
                print('random')
            else:
                href = link.get('href')
                url = "https://physionet.org/" + href + "1.0.0/"
                data_url.append(url)
        i +=1

    for url in data_url:
        format_dataset = {}
        response = requests.get(url)
        soup = BeautifulSoup(response.text)
        format_dataset['url'] = url
        format_dataset['title'] = soup.title.string #title
   
        #description of the dataset
        for content in soup.find_all('meta'):
            if content.get('name') == "description":
                format_dataset['description'] = content.get('content')
    
        #authors and citation
        format_dataset['author'] = soup.find('td').string
    
        # download
        for li in soup.find_all('li'):
            for a in li.find_all('a'):
                url = a.get('href')
                if 'zip' in url:
                    format_dataset['download'] = 'https://physionet.org'+ url
        five_datasets.append(format_dataset)
    
    return {"datasets": five_datasets}, 200

@app.route('/hw1checkin', methods=['POST'])
def hw1checkin():
    data = request.get_json()
    projectid = data.get("projectid")
    amount = int(data.get("amount"))

    if not (project_collection.find_one({"_id" : ObjectId(projectid)})):
        return {"success" : False}, 200

    project = project_collection.find_one({"_id" : ObjectId(projectid)})
    already_checkout_hw1 = project["hwset1"]
    
    if(amount > already_checkout_hw1):
        return {"success" : False}, 200
    
    else:
        new_checked_out = already_checkout_hw1 - amount
        current_availability = hwsets_collection.find_one({"Name": "HWSet1"})["Availability"]
        new_availability = current_availability + amount
        project_collection.update_one({"_id" : ObjectId(projectid)}, {"$set":{"hwset1": new_checked_out}})
        hwsets_collection.update_one({"Name": "HWSet1"}, {"$set": {"Availability": new_availability}})
        return {"success" : True}, 200

@app.route('/hw1checkout', methods=['POST'])
def hw1checkout():
    data = request.get_json()
    projectid = data.get("projectid")
    amount = data.get("amount")

    project = project_collection.find_one({"_id" : ObjectId(projectid)})
    already_checkout_hw1 = project["hwset1"]
    current_availability = hwsets_collection.find_one({"Name": "HWSet1"})["Availability"]


    if(int(amount) > current_availability):
        return {"success" : False}, 200
    
    else:
        new_checked_out = already_checkout_hw1 + int(amount)
        new_availability = current_availability - int(amount)
        project_collection.update_one({"_id" : ObjectId(projectid)}, {"$set":{"hwset1": new_checked_out}})
        hwsets_collection.update_one({"Name": "HWSet1"}, {"$set": {"Availability": new_availability}})
        return {"success" : True}, 200

@app.route('/hw2checkin', methods=['POST'])
def hw2checkin():
    data = request.get_json()
    projectid = data.get("projectid")
    amount = int(data.get("amount"))

    if not (project_collection.find_one({"_id" : ObjectId(projectid)})):
        return {"success" : False}, 200

    project = project_collection.find_one({"_id" : ObjectId(projectid)})
    already_checkout_hw2 = project["hwset2"]
    
    if(amount > already_checkout_hw2):
        return {"success" : False}, 200
    
    else:
        new_checked_out = already_checkout_hw2 - amount
        current_availability = hwsets_collection.find_one({"Name": "HWSet2"})["Availability"]
        new_availability = current_availability + amount
        project_collection.update_one({"_id" : ObjectId(projectid)}, {"$set":{"hwset2": new_checked_out}})
        hwsets_collection.update_one({"Name": "HWSet2"}, {"$set": {"Availability": new_availability}})
        return {"success" : True}, 200

@app.route('/hw2checkout', methods=['POST'])
def hw2checkout():
    data = request.get_json()
    projectid = data.get("projectid")
    amount = data.get("amount")

    project = project_collection.find_one({"_id" : ObjectId(projectid)})
    already_checkout_hw2 = project["hwset2"]
    current_availability = hwsets_collection.find_one({"Name": "HWSet2"})["Availability"]

    if(int(amount) > current_availability):
        return {"success" : False}, 200
    
    else:
        new_checked_out = already_checkout_hw2 + int(amount)
        new_availability = current_availability - int(amount)
        project_collection.update_one({"_id" : ObjectId(projectid)}, {"$set":{"hwset2": new_checked_out}})
        hwsets_collection.update_one({"Name": "HWSet2"}, {"$set": {"Availability": new_availability}})
        return {"success" : True}, 200

@app.route('/getAvail', methods=['POST'])
def getAvail():
    data = request.get_json()
    projectid = data.get("project_id")
    return {
        "avail1": hwsets_collection.find_one({"Name": "HWSet1"})["Availability"], 
        "avail2": hwsets_collection.find_one({"Name": "HWSet2"})["Availability"],
        "checkout1": project_collection.find_one({"_id" : ObjectId(projectid)})["hwset1"],
        "checkout2": project_collection.find_one({"_id" : ObjectId(projectid)})["hwset2"]
         }, 200

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0')