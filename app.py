# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/16 22:40
# @介绍    :
from common import *
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/RegisterReq', methods=["POST"])
def RegisterReq():
    data = request.get_json()
    user = {
        'status': 0,
        'message': '',
        'address': '',
        'privateKeys': '',
        'S': '',
        'P': '',
        'M': '',
        'X': '',
    }
    try:
        if data['identity'] is None :
            user['message'] = "身份信息不能为空"
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


@app.route('/LoginReq', methods=["POST"])
def LoginReq():
    data = request.get_json()
    login = {
        'status': 0,
        'message':'',
        'userName': '',
        'address':''
    }
    try:
        if data['privateKeys'] is None or data['identity'] is None:
            login['message'] = "参数不完整"
            return json.dumps(login)
        return verifyprivateKeys(data['privateKeys'],data['identity'],login)
    except Exception as e:
        login['message'] = "登录失败 原因 {}".format(str(e))
        return json.dumps(login)

@app.route('/ChangeNameReq', methods=["POST"])
def ChangeNameReq():
    data = request.get_json()
    change={
        'status': 0,
        'message': '',
        'newName': '',
    }
    try:
        if data['oldName'] is None or data['privateKey'] is None or data['newName'] is None or data['identity'] is None:
            change['message'] = "参数不完整"
            return json.dumps(change)
        return ChangeName(data,change)
    except Exception as e:
        change['message'] = "下载失败 原因 {}".format(str(e))
        return json.dumps(change)

@app.route('/UploadReq', methods=["POST"])
def UploadReq():
    upload={
        'status': 0,
        'message': '',
        'hash': ''
    }
    if 'file' not in request.files:
        return json.dumps(upload)
    # 前端上传文件,后端处理给webase
    file = request.files['file']
    address = request.args.get('address')
    if file.filename == '' or address is None:
        return json.dumps(upload)
    return uploadIpfs(file,address,upload)
@app.route('/DownloadFileReq', methods=['POST'])
def DownloadFileReq():
    data = request.get_json()
    download={
        'status': 0,
        'fileName': '',
        'base64': '',
    }
    try:
        if data['fileHash'] is None :
            download['message'] = "参数不完整"
            return json.dumps(download)
        return downloadByipfs(data['fileHash'],download)
    except Exception as e:
        download['message'] = "下载失败 原因 {}".format(str(e))
        return json.dumps(download)

@app.route('/GetFileMesReq', methods=["POST"])
def GetFileMesReq():
    data = request.get_json()
    message={}
    try:
        if data['address'] is None :
            return json.dumps(message)
        return getResumeMessage(data['address'],message)
    except Exception as e:
        return json.dumps(message)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
