# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/16 22:40
# @介绍    :
import json

import settings
from common import *
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(settings.Configs)  # 加载flask项目配置
CORS(app, supports_credentials=True)


@app.route('/register', methods=["POST"])
def registerRoute():
    data = request.get_json()
    user = {
        'status': '注册失败',
        'hashID': '',
        'identity': '',
        'ETHAccounts': '',
        'PrivateKeys': ''
    }
    try:
        if data['hashID'] is None or data['identity'] is None:
            user['status'] = "用户名或身份信息不能为空"
            return json.dumps(user)
        else:
            if verifyIdentity(data['identity']):
                return register(data['hashID'], data['identity'], user)
            else:
                user['status'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
                return json.dumps(user)
    except Exception as e:
        user['status'] = "注册失败"
        return json.dumps(user)


@app.route('/login', methods=["POST"])
def loginRoute():
    data = request.get_json()
    login = {
        'status': 0,
    }
    try:
        if verifyPrivateKeys(data['PrivateKeys']):
            login['status'] = 1
            return json.dumps(login)
        else:
            return json.dumps(login)
    except Exception as e:
        return json.dumps(login)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
