# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/16 22:40
# @介绍    :
import json

from common import *
from flask import Flask, request, jsonify

app = Flask(__name__)

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
    }
    if data['identity']=='Applicant':
        try:
            username=verifyPrivateKeys(data['PrivateKeys'], data['username'])
            if not (username is None):
                login['status'] = 1
                login['username'] = username
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

@app.route('/upload', methods=["POST"])
def uploadRoute():
    upload={
        'status': 0,
        'hash': '',
    }
    if 'file' not in request.files:
        return json.dumps(upload)

    file = request.files['file']
    if file.filename == '':
        return json.dumps(upload)
    return uploadIpfs(file,upload)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
