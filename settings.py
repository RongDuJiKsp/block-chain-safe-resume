# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py
# @Author  : LtmThink
# @Date    : 2024/3/17 10:40
# @介绍    :

class Configs:
    # 设置连接数据库路径
    user = 'root'
    password = "123456"
    host = "127.0.0.1"
    database= "safe_resume"

    # ipfs设置
    ipfs_host = "http://47.97.255.9:6001"
    ipfs_url_upload = ipfs_host + "/api/v0/add"

    # WeBASE接口设置
    WeBASE_privateKey_api="http://47.97.255.9:5002/WeBASE-Front/privateKey"


