# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 8:40
# @介绍    :
import json
from settings import Configs
from asmuth_bloom import *
import pymysql
import requests
import pika
import ipfsapi

global config
config = Configs()
api = ipfsapi.connect('127.0.0.1', 6001)
def verifyIdentity(identity):
    list=["Applicant","Recruiter","KeyKeeper"]
    if identity in list:
        return 1
    else:
        return 0
def randName():
    return ''.join(random.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8))
def getKey(hashID):
    url=f'http://47.97.255.9:5002/WeBASE-Front/privateKey?type=2&appId=2&returnPrivateKey=true&signUserId={hashID}'
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

        key=getKey(data['hashID'])
        need=getNeed()
        #插入用户信息
        condition = f'insert into users(hashID,ETHAccounts,PublicKeys,identity,P) values(%s,%s,%s,%s,%s);'
        cur.execute(condition, (data['username'],data['hashID'], key["address"],key['publicKey'],data['identity'],need['P']))

        if cur.rowcount:
            #更新ETHAccounts状态
            user['status'] = 1
            user['username'] = randName()
            user['hashID'] = data['hashID']
            user['ETHAccounts'] = key["address"]
            user['PublicKeys'] = key['publicKey']
            user['PrivateKeys'] = key['privateKey']
            user['identity'] = data['identity']
            user['S'] = need['S']
            user['P'] = need['P']
            user['M'] = need['M']
            user['X'] = need['X']
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
def uploadIpfs(file,upload):
    try:
        # 添加文件到 IPFS
        file_content = file.read()
        res = api.add_bytes(file_content)
    except Exception as e:
        return upload
    upload['status'] = 1
    upload['hash'] = res['Hash']
    return json.dumps(upload)

def eventListener():
    # 创建连接
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))

    # 创建通道
    channel = connection.channel()

    # 声明队列
    channel.queue_declare(queue='my_queue')

    # 设置 'my_queue' 队列的回调函数
    channel.basic_consume(queue='my_queue', on_message_callback=callback, auto_ack=True)

    print('Waiting for messages. To exit press CTRL+C')

    # 开始接收信息
    channel.start_consuming()
def callback(ch, method, properties, body):
    print("Received %r" % body)