# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 8:40
# @介绍    :
import json
import re
import pymysql

def verifyIdentity(identity):
    list=["Applicant","Recruiter","KeyKeeper"]
    if identity in list:
        return 1
    else:
        return 0

def verifyPrivateKeys(PrivateKeys):
    list = [
        "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
        "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
        "0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c",
        "0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913",
        "0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743",
        "0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd",
        "0xe485d098507f54e7733a205420dfddbe58db035fa577fc294ebd14db90767a52",
        "0xa453611d9419d0e56f499079478fd72c37b251a94bfde4d19872c44cf65386e3",
        "0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4",
        "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773",
    ]
    if PrivateKeys in list:
        return 1
    else:
        return 0

def register(hashID,identity,user):
    with pymysql.connect(host='127.0.0.1', user='root', password='123456', database='safe_resume') as conn, conn.cursor() as cur:
        #判断用户名是否已经存在
        condition = f'select * from users where hashID=%s'
        cur.execute(condition, (hashID,))
        if cur.fetchone():
            user['status'] = "hashID已经存在"
            return json.dumps(user)

        #获取ETHAccounts
        condition = f'select ETHAccounts,PrivateKeys from usersResource limit 1'
        cur.execute(condition)
        results = cur.fetchall()
        ETHAccounts = results[0][0]
        PrivateKeys = results[0][1]


        #插入用户信息
        condition = f'insert into users(hashID,ETHAccounts,identity) values(%s,%s,%s);'
        cur.execute(condition, (hashID, ETHAccounts,identity))

        if cur.rowcount:
            #更新ETHAccounts状态
            condition = f"DELETE FROM usersResource WHERE ETHAccounts='"+ETHAccounts+"'";
            cur.execute(condition)
            user['status'] = "注册成功"
            user['hashID'] = hashID
            user['ETHAccounts'] = ETHAccounts
            user['PrivateKeys'] = PrivateKeys
            user['identity'] = identity
            return json.dumps(user)
        else:
            return json.dumps(user)


