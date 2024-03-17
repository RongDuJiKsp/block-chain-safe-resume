# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 8:40
# @介绍    :
import json
import re
import pymysql

def verifyUsername(username):
    Pattern = re.compile(r'^[a-zA-Z0-9_-]{4,16}$')
    result = Pattern.match(username)
    if result:
        return 1
    else:
        return 0

def register(username,user):
    with pymysql.connect(host='127.0.0.1', user='root', password='123456', database='safe_resume') as conn, conn.cursor() as cur:
        #判断用户名是否已经存在
        condition = 'select * from users where name=%s'
        cur.execute(condition, (username,))
        if cur.fetchone():
            user['status'] = "用户名已经存在"
            return json.dumps(user)

        #获取ETHAccounts
        condition = 'select ETHAccounts,PrivateKeys from usersResource limit 1'
        cur.execute(condition)
        results = cur.fetchall()
        ETHAccounts = results[0][0]
        PrivateKeys = results[0][1]


        #插入用户信息
        condition = 'insert into users(name,ETHAccounts) values(%s,%s);'
        cur.execute(condition, (username, ETHAccounts))

        if cur.rowcount:
            #更新ETHAccounts状态
            condition = "DELETE FROM usersResource WHERE ETHAccounts='"+ETHAccounts+"'";
            cur.execute(condition)
            user['status'] = "注册成功"
            user['username'] = username
            user['ETHAccounts'] = ETHAccounts
            user['PrivateKeys'] = PrivateKeys
            return json.dumps(user)
        else:
            return json.dumps(user)


