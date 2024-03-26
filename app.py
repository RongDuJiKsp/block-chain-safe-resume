# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/16 22:40
# @介绍    :
import json
import mimetypes

from common import *
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=["POST"])
def registerRoute():
    data = request.get_json()
    user = {
        'status': 0,
        'username': '',
        'hashID': '',
        'identity': '',
        'ETHAccounts': '',
        'PublicKeys': '',
        'PrivateKeys': '',
        'S': '',
        'P': '',
        'M': '',
        'X': '',
        'message': '注册失败'
    }
    try:
        if data['hashID'] is None or data['identity'] is None or data['username'] is None:
            user['message'] = "用户名或身份信息不能为空"
            return json.dumps(user)
        else:
            if verifyIdentity(data['identity']):
                return register(data, user)
            else:
                user['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
                return json.dumps(user)
    except Exception as e:
        user['message'] = "注册失败 原因 {}".format(str(e))
        return json.dumps(user)


@app.route('/login', methods=["POST"])
def loginRoute():
    data = request.get_json()
    login = {
        'status': 0,
        'username': '',
        'ETHAccounts':''
    }
    if data['identity']=='Applicant':
        try:
            key=verifyPrivateKeys(data['PrivateKeys'], data['username'])
            if not (key["userName"] is None):
                login['status'] = 1
                login['username'] = key["userName"]
                login['ETHAccounts'] = key["address"]
                return json.dumps(login)
            else:
                return json.dumps(login)
        except Exception as e:
            return json.dumps(login)
    elif data['identity']=='Recruiter':
        try:
            login['status']=verifyRecruiter(data['username'])
            if login['status']==1:
                login['username'] = data['username']
                return json.dumps(login)
            else:
                return json.dumps(login)
        except Exception as e:
            return json.dumps(login)
    elif data['identity']=='KeyKeeper':
        try:
            login['status']=verifyKeyKeeper(data['username'])
            if login['status']==1:
                login['username'] = data['username']
                return json.dumps(login)
            else:
                return json.dumps(login)
        except Exception as e:
            return json.dumps(login)

@app.route('/upload', methods=["POST"])
def uploadRoute():
    upload={
        'status': 0,
        'hash': '',
        'type': '',
        'name': ''
    }
    if 'file' not in request.files:
        return json.dumps(upload)

    file = request.files['file']
    hashID = request.args.get('hashID')
    if file.filename == '' or hashID is None:
        return json.dumps(upload)
    return uploadIpfs(file,hashID,upload)
@app.route('/getFileMessage', methods=["POST"])
def getFileMessage():
    message={
        'status': 0,
        'putTime': '',
        'downloadtimes': '',
    }
    hashID=request.form['hashID']
    if hashID == '':
        return json.dumps(message)
    return getResumeMessage(hashID,message)

@app.route('/download', methods=['GET'])
def download_file():
    download={
        'status': 0,
    }
    # IPFS gateway URL
    file_hash=request.args.get('fileHash')
    file_name=request.args.get('fileName')
    if file_hash is None or file_name is None:
        return json.dumps(download)
    return downloadByipfs(file_hash,file_name,download)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
