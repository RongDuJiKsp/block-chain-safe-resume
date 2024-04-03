# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 8:40
# @介绍    :
import base64
import json
from settings import Configs
from asmuth_bloom import *
import pymysql
import requests
from eth_abi import decode

global config
config = Configs()
conn = pymysql.connect(host=config.host, user=config.user, password=config.password, database=config.database)
cur = conn.cursor()
cur.execute('SET GLOBAL wait_timeout = 288000000')
cur.execute('SET GLOBAL interactive_timeout = 288000000')
cur.execute('set global max_allowed_packet=288000000')


def verifyIdentity(identity):
    list = ["Applicant", "Recruiter", "KeyKeeper"]
    if identity in list:
        return 1
    else:
        return 0


def randName():
    return ''.join(random.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12))


def getKey(userName):
    url = config.WeBASE_privateKey_api + f'?type=2&appId=2&returnPrivateKey=True&signUserId={userName}'
    response = requests.get(url)
    key = response.json()
    privateKey = base64.b64decode(key['privateKey']).decode('utf-8')
    url2 = config.WeBASE_privateKey_api + f"/import?privateKey={privateKey}&userName={userName}"
    response2 = requests.get(url2)
    return key


def getTableName(identity):
    if identity == 'Applicant':
        return 'Applicant'
    elif identity == 'Recruiter':
        return 'Recruiter'
    elif identity == 'KeyKeeper':
        return 'KeyKeeper'
    else:
        return 'error'


def apiApregister(address, X, M, P, T):
    url = config.api_url
    config.api_data["user"] = address
    config.api_data["funcName"] = 'Apregister'
    config.api_data["funcParam"] = [f'{X}', f'{M}',f'{P}', f'{T}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        if reslut['status'] == "0x0":
            return True
        else:
            return False
    except Exception as e:
        return False

def apiFileUpdate(address,hash_code, file_name, file_type):
    url = config.api_url
    config.api_data["user"] = address
    config.api_data["funcName"] = 'FileUpdate'
    config.api_data["funcParam"] = [f'{hash_code}', f'{file_name}', f'{file_type}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        if reslut['status'] == "0x0":
            return True
        else:
            return False
    except Exception as e:
        return False
def apiKeeperaply(KKAddress):
    url = config.api_url
    config.api_data["user"] = KKAddress
    config.api_data["funcName"] = 'keeperaply'
    config.api_data["funcParam"] = []
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        if reslut['status'] == "0x0":
            return True
        else:
            return False
    except Exception as e:
        return False

def apiReturnsubkey(ApAddress,KKAddress,part):
    url = config.api_url
    config.api_data["user"] = KKAddress
    config.api_data["funcName"] = 'returnsubkey'
    config.api_data["funcParam"] = [f'{ApAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        if reslut['status'] == "0x0":
            #还需解析返回值
            part['status'] = 1
            types = ['uint', 'uint', 'uint', 'uint']
            decoded_data = decode(types, bytes.fromhex(reslut['output'][2:]))
            part['i'] = decoded_data[0]
            part['x'] = decoded_data[1]
            part['m'] = decoded_data[2]
            part['p'] = decoded_data[3]
            return part
        else:
            return part
    except Exception as e:
        return part

def apiRecRequest(ReAddress,ApAddress):
    url = config.api_url
    config.api_data["user"] = ReAddress
    config.api_data["funcName"] = 'RecRequest'
    config.api_data["funcParam"] = [f'{ReAddress}',f'{ApAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        if reslut['status'] == "0x0":
            return True
        else:
            return False
    except Exception as e:
        return False

def apiAuthorizeUser(ApAddress, ReAddress):
    url = config.api_url
    config.api_data["user"] = ApAddress
    config.api_data["funcName"] = 'authorizeUser'
    config.api_data["funcParam"] = [f'{ReAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        if reslut['status'] == "0x0":
            return True
        else:
            return False
    except Exception as e:
        return False

def apiGetresumekey(ReAddress,ApAddress,base):
    url = config.api_url
    config.api_data["user"] = ApAddress
    config.api_data["funcName"] = 'Getresumekey'
    config.api_data["funcParam"] = [f'{ReAddress}',f'{ApAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        if reslut['status'] == "0x0":
            #还需解析返回值
            base['status'] = 1
            types = ['uint', 'string', 'string']
            decoded_data = decode(types, bytes.fromhex(reslut['output'][2:]))
            base['s'] = decoded_data[0]
            base['fileName'] = decoded_data[1]
            base['fileType'] = decoded_data[2]
            return base
        else:
            base['message'] = reslut['message']
            return base
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return base
def verifyprivateKeys(privateKey, identity, login):
    name = randName()
    url = config.WeBASE_privateKey_api + f'/import?privateKey={privateKey}&userName={name}'
    response = requests.get(url)
    key = response.json()
    if response.status_code == 200:
        table_name = getTableName(identity)
        if table_name == 'error':
            login['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
            return json.dumps(login)
        condition = f'select * from {table_name} where address=%s'
        cur.execute(condition, (key['address']))
        result = cur.fetchone()
        if result:
            login['status'] = 1
            login['message'] = "登录成功"
            login['userName'] = result[0]
            login['address'] = result[1]
            return json.dumps(login)
        else:
            return json.dumps(login)


def register(data, user):
    userName = randName()
    key = getKey(userName)
    need = getNeed()
    # T==S
    if apiApregister(key['address'], need['X'], need['M'], need['P'], need['S'])==False:
        user['message'] = "注册失败"
        return json.dumps(user)
    table_name = getTableName(data['identity'])
    if table_name == 'error':
        user['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
        return json.dumps(user)
    # 插入用户信息
    condition = f"insert into {table_name}(userName,address,publicKeys,P) values(%s,%s,%s,%s);"
    cur.execute(condition, (userName, key["address"], key['publicKey'], need['P']))
    if table_name == 'Applicant':
        condition = f"insert into NeedSave(userName,address,remainingAmount) values(%s,%s,5);"
        cur.execute(condition, (userName, key["address"]))
    elif table_name == 'KeyKeeper':
        apiKeeperaply(key["address"])
    if cur.rowcount:
        # 更新address状态
        user['status'] = 1
        user['message'] = "注册成功"
        user['address'] = key["address"]
        # user['publicKeys'] = key['publicKey']
        user['privateKeys'] = key['privateKey']
        # user['identity'] = data['identity']
        user['S'] = need['S']
        user['P'] = need['P']
        user['M'] = need['M']
        user['X'] = need['X']
        return json.dumps(user)
    else:
        return json.dumps(user)


def uploadIpfs(file,userName, address, upload):
    files = {
        'file': (file.filename, file)
    }
    response = requests.post(config.ipfs_url_upload, files=files)
    # 简历信息上链
    if response.status_code == 200:
        data = json.loads(response.text)
        hash_code = data['Hash']
        apiFileUpdate(address, hash_code, file.filename, file.content_type)
        condition = f'insert into resumeForm(userName,address,putTime,downloadtimes) values(%s,%s,UNIX_TIMESTAMP(),0);'
        cur.execute(condition, (userName,address))
    else:
        return json.dumps(upload)
    upload['status'] = 1
    upload['message'] = '上传成功'
    upload['hash'] = hash_code
    return json.dumps(upload)


def getMoreFileMes(address, base):
    # 在hr表中
    # 查询resumeForm表所有内容
    condition = f'select * from resumeForm where address=%s'
    cur.execute(condition, (address))
    if cur.rowcount:
        result=cur.fetchone();
        base['status'] = 1
        base['userName'] = result[0]
        base['putTime'] = result[2]
        base['downloadtimes'] = result[3]
        return json.dumps(base)
    else:
        return json.dumps(base)


def downloadByipfs(file_hash,ApUserName,ReUserName,download):
    # 和合约交互获取文件哈希和文件名等
    file_name = "test"
    # 从ipfs处下载文件
    gateway_url = config.ipfs_url_download + f"{file_hash}?download=True&filename={file_name}"
    url = gateway_url + file_hash
    response = requests.get(url)
    # 返回
    if response.status_code == 200:
        # 保存到历史记录
        condition = f'insert into DownloadHisForm(ApUserName,ReUserName,downloadtime) values(%s,%s,UNIX_TIMESTAMP());'
        cur.execute(condition, (ApUserName, ReUserName))
        # 向kk发送获取请求
        condition = f'select KKAddress from KKAlreadySave where ApUserName=%s'
        cur.execute(condition, (ApUserName))
        KKAddress= cur.fetchone()[0]
        condition = f'insert into needKEY(ApUserName,KKAddress,time) values(%s,%s,UNIX_TIMESTAMP());'
        cur.execute(condition, (ApUserName, KKAddress))
        download['status'] = 1
        download['fileName'] = file_name
        download['body'] = base64.b64encode(response.content).decode('utf-8')
        return download
    else:
        return download


def ChangeName(data, change):
    table_name = getTableName(data['identity'])
    if table_name == 'error':
        change['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
        return json.dumps(change)
    # 判断用户名是否已经存在
    condition = f"select * from {table_name} where userName=%s"
    cur.execute(condition, (data["oldName"]))
    if cur.fetchone():
        condition = f"update {table_name} set userName=%s where userName=%s"
        cur.execute(condition, (data['newName'], data['oldName']))
        if cur.rowcount:
            change['status'] = 1
            change['message'] = "修改成功"
            change['newName'] = data['newName']
            return json.dumps(change)
        else:
            return json.dumps(change)
    else:
        change['message'] = "用户名不存在"
        return json.dumps(change)
def getNeedSave(KKAddress,base):
    condition = f'select * from NeedSave where remainingAmount>0 and address not in (select ApAddress from KKAlreadySave where KKAddress=%s) ;'
    cur.execute(condition,(KKAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def SavePart(ApUserName,ApAddress,KKAddress,part):
    part=apiReturnsubkey(ApAddress,KKAddress,part)
    if part['status']==0:
        return json.dumps(part)
    condition = f'UPDATE NeedSave SET remainingAmount = remainingAmount - 1 where address=%s;'
    cur.execute(condition,(ApAddress))
    condition = f'insert into KKAlreadySave(ApUserName,ApAddress,KKAddress) values(%s,%s,%s);'
    cur.execute(condition, (ApUserName,ApAddress, KKAddress))
    return json.dumps(part)

def getSave(KKAddress,base):
    condition = f'select * from KKAlreadySave where KKAddress=%s;'
    cur.execute(condition,(KKAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)


def getResume(ReAddress,base):
    condition = f'select * from resumeForm where address not in (select ApAddress from AlreadyResumeForm where ReAddress=%s) ;'
    cur.execute(condition,(ReAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

#请求授权查看简历
def recAuthorize(ApUserName,ApAddress,ReAddress):
    re = apiRecRequest(ReAddress,ApAddress)
    if re == False:
        return False
    condition = f'insert into AlreadyResumeForm(ApUserName,ApAddress,ReAddress,ststus) values(%s,%s,%s,0);'
    cur.execute(condition, (ApUserName,ApAddress, ReAddress))
    return True

def recAlreadyAuthorizeReq(ReAddress,base):
    condition = f'select * from AlreadyResumeForm where ReAddress=%s;'
    cur.execute(condition,(ReAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def getRequest(address,base):
    condition = f'select AlreadyResumeForm.ApUserName,AlreadyResumeForm.ApAddress,Recruiter.userName,AlreadyResumeForm.ReAddress ,AlreadyResumeForm.ststus from AlreadyResumeForm join Recruiter on  Recruiter.address=AlreadyResumeForm.ReAddress  where AlreadyResumeForm.ApAddress=%s;'
    cur.execute(condition,(address))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def apAuthorize(ApAddress,ReAddress):
    re = apiAuthorizeUser(ApAddress, ReAddress)
    if re == False:
        return json.dumps({'status': 0, 'message': '授权失败,请重试'})
    condition = f'update AlreadyResumeForm set ststus=1 where ApAddress=%s and ReAddress=%s;'
    cur.execute(condition, (ApAddress, ReAddress))
    return json.dumps({'status': 1, 'message': '授权成功'})

#拒绝授权更新数据库
def rejectAuthorize(ApAddress,ReAddress):
    condition = f'DELETE FROM AlreadyResumeForm where ApAddress=%s and ReAddress=%s;'
    cur.execute(condition, (ApAddress, ReAddress))
    return json.dumps({'status': 1, 'message': '更新成功'})

def getFileMes(ApAddress, ReAddress,base):
    return apiGetresumekey(ReAddress,ApAddress,base)

def getDownloadHis(ApUserName,base):
    condition = f'select * from DownloadHisForm where ApUserName=%s;'
    cur.execute(condition,(ApUserName))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def searchAp(partApUserName,base):
    condition = f'select userName,address from Applicant where userName like %s;'
    cur.execute(condition,('%'+partApUserName+'%'))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def remindKK(KKAddress,base):
    condition = f'select * from needKEY where KKAddress=%s;'
    cur.execute(condition,(KKAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)