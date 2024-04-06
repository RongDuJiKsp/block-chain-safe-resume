# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py
# @Author  : LtmThink
# @Date    : 2024/3/17 10:40
# @介绍    :
# SZYjsw142590

class Configs:
    # 设置连接数据库路径
    user = 'root'
    password = "123456"
    host = "127.0.0.1"
    database= "safe_resume"

    # ipfs设置
    ipfs_host = "http://47.97.255.9:6001"
    ipfs_url_upload = ipfs_host + "/api/v0/add"
    ipfs_url_download = "http://47.97.255.9:8080/ipfs/"

    # WeBASE接口设置
    WeBASE_privateKey_api="http://47.97.255.9:5002/WeBASE-Front/privateKey"

    # 合约函数调用
    api_url = f'http://47.97.255.9:5002/WeBASE-Front/trans/handle'
    api_data = {
        "groupId": "1",
        "user": "",
        "contractName": "sharecv",
        "funcName": "",
        "funcParam": [],
        "contractAddress": "0x63fe85e375c974b1638274677ff716f1f2e1d82d",
        "contractAbi":[{"inputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"shortName","type":"string"},{"internalType":"uint8","name":"minUnit","type":"uint8"},{"internalType":"uint256","name":"totalAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"","type":"string"},{"indexed":False,"internalType":"address","name":"rec","type":"address"},{"indexed":False,"internalType":"address","name":"ap","type":"address"},{"indexed":False,"internalType":"uint256","name":"time","type":"uint256"},{"indexed":False,"internalType":"string","name":"text","type":"string"}],"name":"Authorization","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"","type":"string"},{"indexed":False,"internalType":"address","name":"rec","type":"address"},{"indexed":False,"internalType":"address","name":"ap","type":"address"},{"indexed":False,"internalType":"uint256","name":"time","type":"uint256"}],"name":"Downloadrecord","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"","type":"string"},{"indexed":False,"internalType":"address","name":"ap","type":"address"},{"indexed":False,"internalType":"uint256","name":"time","type":"uint256"},{"indexed":False,"internalType":"string","name":"text","type":"string"}],"name":"FileUpdated","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"","type":"string"},{"indexed":False,"internalType":"address","name":"kk","type":"address"},{"indexed":False,"internalType":"string","name":"text","type":"string"},{"indexed":False,"internalType":"uint256","name":"time","type":"uint256"}],"name":"Kkstatus","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"","type":"string"},{"indexed":False,"internalType":"address","name":"rec","type":"address"},{"indexed":False,"internalType":"address","name":"ap","type":"address"},{"indexed":False,"internalType":"uint256","name":"time","type":"uint256"},{"indexed":False,"internalType":"string","name":"text","type":"string"}],"name":"Requests","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"","type":"string"},{"indexed":True,"internalType":"address","name":"from","type":"address"},{"indexed":True,"internalType":"address","name":"to","type":"address"},{"indexed":False,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":False,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Send","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"","type":"string"},{"indexed":False,"internalType":"address","name":"kk","type":"address"},{"indexed":False,"internalType":"address","name":"ap","type":"address"},{"indexed":False,"internalType":"uint256","name":"time","type":"uint256"},{"indexed":False,"internalType":"string","name":"text","type":"string"}],"name":"Uploadsubkey","type":"event"},{"inputs":[{"internalType":"uint256[]","name":"x","type":"uint256[]"},{"internalType":"uint256[]","name":"m","type":"uint256[]"},{"internalType":"uint256","name":"p","type":"uint256"},{"internalType":"uint256","name":"t","type":"uint256"}],"name":"Apkeysupload","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"rec","type":"address"}],"name":"AuthorizeUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"rec","type":"address"},{"internalType":"address","name":"ap","type":"address"}],"name":"DownloadResume","outputs":[{"internalType":"uint256","name":"s","type":"uint256"},{"internalType":"string","name":"filename","type":"string"},{"internalType":"string","name":"filetype","type":"string"},{"internalType":"string","name":"hashData","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"hashData","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"string","name":"fileType","type":"string"}],"name":"FileUpdate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"KeeperApply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"ap","type":"address"},{"internalType":"uint256","name":"i","type":"uint256"},{"internalType":"uint256","name":"xi","type":"uint256"},{"internalType":"uint256","name":"mi","type":"uint256"}],"name":"KeeperkeysUpload","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"rec","type":"address"},{"internalType":"address","name":"ap","type":"address"}],"name":"RecRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"ap","type":"address"}],"name":"Returnsubkey","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"_send","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"m_t","type":"uint256[]"}],"name":"divresult","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"p","type":"uint256"}],"name":"invmod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"rec","type":"address"},{"internalType":"address","name":"ap","type":"address"}],"name":"isUserAuthorized","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"p","type":"uint256"},{"internalType":"uint256[]","name":"m","type":"uint256[]"},{"internalType":"uint256[]","name":"a","type":"uint256[]"},{"internalType":"address","name":"ap","type":"address"}],"name":"verify_recover","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}],
        "useCns": False,
    }
