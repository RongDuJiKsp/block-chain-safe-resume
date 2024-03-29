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

global config
config = Configs()
conn = pymysql.connect(host=config.host, user=config.user, password=config.password, database=config.database)
cur = conn.cursor()
def verifyIdentity(identity):
    list=["Applicant","Recruiter","KeyKeeper"]
    if identity in list:
        return 1
    else:
        return 0
def randName():
    return ''.join(random.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8))
def getKey(userName):
    url=config.WeBASE_privateKey_api+f'?type=2&appId=2&returnPrivateKey=true&signUserId={userName}'
    response = requests.get(url)
    key=response.json()
    privateKey= base64.b64decode(key['privateKey']).decode('utf-8')
    url2 = config.WeBASE_privateKey_api + f"/import?privateKey={privateKey}&userName="
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
def verifyprivateKeys(privateKey,identity,login):
    name=randName()
    url = config.WeBASE_privateKey_api+f'/import?privateKey={privateKey}&userName={name}'
    response = requests.get(url)
    key = response.json()
    if response.status_code == 200:
        table_name = getTableName(identity)
        if table_name == 'error':
            login['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
            return json.dumps(login)
        condition = f'select * from {table_name} where address=%s'
        cur.execute(condition,(key['address']))
        result = cur.fetchone()
        if result:
            login['status'] = 1
            login['message'] = "登录成功"
            login['userName'] = result[0]
            login['address'] = result[1]
            return json.dumps(login)
        else:
            return json.dumps(login)
def register(data,user):
        userName = randName()
        key = getKey(userName)
        need = getNeed()
        table_name = getTableName(data['identity'])
        if table_name == 'error':
            user['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
            return json.dumps(user)
        # 插入用户信息
        condition = f"insert into {table_name}(userName,address,publicKeys,P) values(%s,%s,%s,%s);"
        cur.execute(condition, (userName, key["address"], key['publicKey'], need['P']))

        if cur.rowcount:
            # 更新address状态
            user['status'] = 1
            user['message'] = "注册成功"
            user['userName'] = userName
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

def uploadIpfs(file,address,upload):
    files = {
        'file':(file.filename, file)
    }
    # 简历加密,简历上链
    response = requests.post(config.ipfs_url_upload, files=files)
    if response.status_code == 200:
        data = json.loads(response.text)
        hash_code = data['Hash']
        condition = f'insert into resumeForm(address,putTime,downloadtimes) values(%s,UNIX_TIMESTAMP(),0);'
        cur.execute(condition,(address))
    else:
        return json.dumps(upload)
    upload['status'] = 1
    upload['message'] = '上传成功'
    upload['hash'] = hash_code
    return json.dumps(upload)

def getResumeMessage(address,message):
        # 在hr表中
        # 查询resumeForm表所有内容
        condition = f'select * from resumeForm where address=%s'
        cur.execute(condition, (address))
        if cur.rowcount:
            result=cur.fetchall()
            return json.dumps(result)
        else:
            return json.dumps(message)

def downloadByipfs(file_hash,download):
    # 和合约交互获取文件哈希和文件名等
    file_name = "test"
    # 从ipfs处下载文件
    gateway_url = config.ipfs_url_download+f"{file_hash}?download=true&filename={file_name}"
    url = gateway_url + file_hash
    response = requests.get(url)
    # 和合约交互解密文件

    # 返回
    if response.status_code == 200:
        download['status'] = 1
        download['fileName'] = file_name
        download['body'] = base64.b64encode(response.content).decode('utf-8')
        return download
    else:
        return download

def ChangeName(data,change):
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
