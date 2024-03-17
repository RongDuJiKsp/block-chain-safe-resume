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

app = Flask(__name__)
app.config.from_object(settings.Configs)  # 加载flask项目配置

@app.route('/register',methods=["POST"])
def registerRoute():
    data = request.form.to_dict()
    user = {
        'status': '注册失败',
        'username': '',
        'ETHAccounts': '',
        'PrivateKeys': ''
    }
    if data['username'] is not None:
        username = data['username']
        if verifyUsername(username):
            return register(username,user)
        else:
            user['status'] = "用户名需要4到16位的字母、数字、下划线或减号"
            return json.dumps(user)
    else:
        user['status'] = "用户名不能为空"
        return json.dumps(user)

@app.route('/login',methods=["POST"])
def loginRoute():
    data = request.form.to_dict()
    print(data['username'])
    print(data['password'])
    return jsonify(data)

if __name__ == '__main__':
   app.run(host='0.0.0.0',port=5000,debug=False)