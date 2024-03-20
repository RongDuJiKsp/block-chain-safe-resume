# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 8:40
# @介绍    :
import json
from settings import Configs
import pymysql
import requests

global config
config = Configs()
def verifyIdentity(identity):
    list=["Applicant","Recruiter","KeyKeeper"]
    if identity in list:
        return 1
    else:
        return 0

def getKey(username):
    url=f'http://47.97.255.9:5002/WeBASE-Front/privateKey?type=0&userName={username}'
    response = requests.get(url)
    key=response.json()
    return key
def verifyPrivateKeys(privateKey,userName):
    url = f'http://47.97.255.9:5002/WeBASE-Front/privateKey/import?privateKey={privateKey}&userName={userName}'
    response = requests.get(url)
    key = response.json()
    return key["userName"]

def verifyRecruiter(username):
    with pymysql.connect(host=config.host, user=config.user, password=config.password, database=config.database) as conn, conn.cursor() as cur:
        #判断用户名是否已经存在
        condition = f'select * from recruiter where username=%s'
        cur.execute(condition, (username))
        if cur.fetchone():
            return 1
        else:
            return 0
def register(data,user):
    if data['identity'] == "Applicant":
        return createApplicant(data,user)
    elif data['identity'] == "Recruiter":
        return createRecruiter(data,user)
    elif data['identity'] == "KeyKeeper":
        return user;

def createApplicant(data,user):
    with pymysql.connect(host=config.host, user=config.user, password=config.password, database=config.database) as conn, conn.cursor() as cur:
        #判断用户名是否已经存在
        condition = f'select * from recruiter where hashID=%s or username=%s'
        cur.execute(condition, (data["hashID"], data["username"]))
        if cur.fetchone():
            user['message'] = "hashID已经存在"
            return json.dumps(user)

        key=getKey(data['username'])
        #插入用户信息
        condition = f'insert into users(username,hashID,ETHAccounts,PublicKeys,identity) values(%s,%s,%s,%s,%s);'
        cur.execute(condition, (data['username'],data['hashID'], key["address"],key['publicKey'],data['identity']))

        if cur.rowcount:
            #更新ETHAccounts状态
            user['status'] = 1
            user['username'] = data['username']
            user['hashID'] = data['hashID']
            user['ETHAccounts'] = key["address"]
            user['PublicKeys'] = key['publicKey']
            user['PrivateKeys'] = key['privateKey']
            user['identity'] = data['identity']
            user['message'] = "注册成功"
            return json.dumps(user)
        else:
            return json.dumps(user)

def createRecruiter(data,user):
    with pymysql.connect(host=config.host, user=config.user, password=config.password, database=config.database) as conn, conn.cursor() as cur:
        #判断用户名是否已经存在
        condition = f'select * from recruiter where hashID=%s or username=%s'
        cur.execute(condition, (data["hashID"],data["username"]))
        if cur.fetchone():
            user['message'] = "hashID已经存在"
            return json.dumps(user)

        #插入用户信息
        condition = f'insert into recruiter(username,hashID) values(%s,%s);'
        cur.execute(condition, (data["username"], data["hashID"]))

        if cur.rowcount:
            #更新ETHAccounts状态
            user['status'] = 1
            user['username']=data["username"]
            user['message'] = "注册成功"
            user['hashID'] = data["hashID"]
            user['identity'] =data['identity']
            return json.dumps(user)
        else:
            return json.dumps(user)

if __name__ == '__main__':
    getKey("ltmthink")