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
# 0.登录注册改用户名三个函数
@app.route('/RegisterReq', methods=["POST"])
def RegisterReq():
    data = request.get_json()
    user = {
        'status': 0,
        'message': '',
        'address': '',
        'S': '',
        'P': '',
        'M': '',
        'X': '',
    }
    try:
        if verifyIdentity(data['identity']):
            return register(data, user)
        else:
            user['message'] = "身份证号格式错误"
            return json.dumps(user)
    except Exception as e:
        user['message'] = "{}".format(str(e))
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
        if data['identity'] is None:
            login['message'] = "参数不完整"
            return json.dumps(login)
        return verifyprivateKeys(data['userName'],data['password'],data['identity'],login)
    except Exception as e:
        login['message'] = "{}".format(str(e))
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
        if data['oldName'] is None or data['address'] is None or data['newName'] is None or data['identity'] is None:
            change['message'] = "参数不完整"
            return json.dumps(change)
        return ChangeName(data,change)
    except Exception as e:
        change['message'] = "{}".format(str(e))
        return json.dumps(change)

#ap查看简历下载次数等
@app.route('/GetMoreFileMesReq', methods=["POST"])
def GetMoreFileMesReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        ApAddress = data['ApAddress']
        return getMoreFileMes(ApAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

#1.申请秘密份额三个函数
# 得到所以待保管秘密份额的ap用户
@app.route('/GetNeedSaveReq', methods=["POST"])
def GetNeedSaveReq():
    data = request.get_json()
    base={
        'status': 0,
        'message': '',
    }
    try:
        KKAddress = data['KKAddress']
        return getNeedSave(KKAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

# 保管秘密份额
@app.route('/SavePartReq', methods=["POST"])
def SavePartReq():
    data = request.get_json()
    part ={
        'status': 0,
        'message': '',
    }
    try:
        ApUserName = data['userName']
        ApAddress = data['address']
        KKAddress = data['KKAddress']
        return SavePart(ApUserName,ApAddress,KKAddress,part)
    except Exception as e:
        part['message'] = "{}".format(str(e))
        return json.dumps(part)
# 查看已经保管的秘密份额
@app.route('/GetSaveReq', methods=["POST"])
def GetSaveReq():
    base = {
        'status': 0,
        'message': '',
    }
    data = request.get_json()
    try:
        return getSave(data["KKAddress"],base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

#2.Recruiter 四个函数
# 返回所以可申请查看简历的ap用户
@app.route('/GetResumeReq', methods=["POST"])
def GetResumeReq():
    data = request.get_json()
    base={
        'status': 0,
        'message': '',
    }
    try:
        ReAddress = data['ReAddress']
        return getResume(ReAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

# 请求授权查看简历
@app.route('/RecAuthorizeReq', methods=["POST"])
def RecAuthorizeReq():
    data = request.get_json()
    authorize = {
        'status': 0,
        'message': '',
    }
    try:
        ApUserName = data['ApUserName']
        ApAddress = data['ApAddress']
        ReAddress = data['ReAddress']
        judge,message=recAuthorize(ApUserName, ApAddress, ReAddress)
        if  judge== False:
            authorize['status'] = 0
            authorize['message'] = message
            return json.dumps(authorize)
        else:
            authorize['status'] = 1
            authorize['message'] = message
            return json.dumps(authorize)
    except Exception as e:
        authorize['message'] = "{}".format(str(e))
        return json.dumps(authorize)

# 已申请简历授权查看
@app.route('/RecAlreadyAuthorizeReq', methods=["POST"])
def RecAlreadyAuthorizeReq():
    data = request.get_json()
    base={
        'status': 0,
        'message': '',
    }
    try:
        ReAddress = data['ReAddress']
        return recAlreadyAuthorizeReq(ReAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

# 授权成功后可以下载文件
@app.route('/DownloadFileReq', methods=['POST'])
def DownloadFileReq():
    data = request.get_json()
    download={
        'status': 0,
        'fileName': '',
        'base64': '',
    }
    try:
        fileHash=data['fileHash']
        ApUserName= data['ApUserName']
        ReUserName= data['ReUserName']
        return downloadByipfs(fileHash,ApUserName,ReUserName,download)
    except Exception as e:
        download['message'] = "{}".format(str(e))
        return json.dumps(download)

#3. ap 三个函数
# 查看简历查看请求
@app.route('/GetRequestReq', methods=["POST"])
def GetRequestReq():
    data = request.get_json()
    base={
        'status': 0,
        'message': '',
    }
    try:
        ApAddress = data['ApAddress']
        return getRequest(ApAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

# 授权查看简历,不同意更新数据库,同意和合约函数交互+更新数据库
@app.route('/ApAuthorizeReq', methods=["POST"])
def ApAuthorizeReq():
    data = request.get_json()
    try:
        # 不同意传0，同意传1
        status = data['status']
        ApAddress = data['ApAddress']
        ReAddress = data['ReAddress']
        if status == 0:
            return rejectAuthorize(ApAddress,ReAddress)
        else:
            updataNeedKEY(ApAddress)
            return apAuthorize(ApAddress,ReAddress)
    except Exception as e:
        return json.dumps({'status': 0, 'message': '{}'.format(str(e))})
# 简历上传函数
@app.route('/UploadReq', methods=["POST"])
def UploadReq():
    upload={
        'status': 0,
        'message': '',
        'hash': ''
    }
    try:
        if 'file' not in request.files:
            return json.dumps(upload)
        # 前端上传文件,后端处理给webase
        file = request.files['file']
        userName = request.args.get('userName')
        address = request.args.get('address')
        if file.filename == '' or address is None:
            return json.dumps(upload)
        return uploadIpfs(file,userName,address,upload)
    except Exception as e:
        upload['message'] = "{}".format(str(e))
        return json.dumps(upload)

@app.route('/GetFileMesReq', methods=["POST"])
def GetFileMesReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        ApAddress = data['ApAddress']
        ReAddress = data['ReAddress']
        return getFileMes(ApAddress, ReAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

@app.route('/GetDownloadHisReq', methods=["POST"])
def GetDownloadHisReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        ApUserName = data['ApUserName']
        return getDownloadHis(ApUserName,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

#.re模糊查找ap
@app.route('/SearchApReq', methods=["POST"])
def SearchApReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        partApUserName = data['partApUserName']
        return searchAp(partApUserName,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

# 提醒kk上传密钥
@app.route('/RemindKKReq', methods=["POST"])
def RemindKKReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        KKAddress = data['KKAddress']
        return remindKK(KKAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)
#kk上传密钥
@app.route('/UploadKeyReq', methods=["POST"])
def UploadKeyReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        KKAddress = data['KKAddress']
        ApUserName = data['ApUserName']
        i = data['i']
        x = data['x']
        m = data['m']
        return uploadKey(KKAddress,ApUserName,i,x,m,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

#kk变成合法密钥保管人
@app.route('/ChangeKKReq', methods=["POST"])
def ChangeKKReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        KKAddress = data['KKAddress']
        return changeKK(KKAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

#查询token余额
@app.route('/GetBalanceReq', methods=["POST"])
def GetBalanceReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        address = data['address']
        return getBalance(address,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)
@app.route('/GetAllKKReq', methods=["POST"])
def GetAllKKReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        ApAddress = data['ApAddress']
        return getAllKK(ApAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

@app.route('/PostOnekeyReq', methods=["POST"])
def PostOnekeyReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        KKAddress= data['KKAddress']
        ApAddress = data['ApAddress']
        publicKeys=data['publicKeys']
        i=data['i']
        x=data['x']
        m=data['m']
        return PostOnekey(KKAddress,ApAddress,publicKeys,i,x,m,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

@app.route('/KKDownloadKeyReq', methods=["POST"])
def KKDownloadKeyReq():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        KKAddress = data['KKAddress']
        ApAddress = data['ApAddress']
        encryptPrivateKeys=data['encryptPrivateKeys']
        return KKDownloadKey(KKAddress,ApAddress,encryptPrivateKeys,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)
@app.route('/aaaaaaa', methods=["POST"])
def aaaaaaa():
    data = request.get_json()
    base = {
        'status': 0,
        'message': '',
    }
    try:
        ApAddress = data['ApAddress']
        return aaaaaa(ApAddress,base)
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return json.dumps(base)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100, debug=False)
