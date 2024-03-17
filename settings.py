# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py
# @Author  : LtmThink
# @Date    : 2024/3/17 10:40
# @介绍    :

class Configs:
    ENV='development'
    DEBUG=True
    # 设置连接数据库路径
    SQLALCHEMY_DATABASE_URI='mysql+pymysql://root:123456@127.0.0.1:3306/safe_resume'
    # 每次请求结束后自动提交数据库中的改动
    SQLALCHEMY_COMMIT_ON_TEARDOWN=True
    # 禁用SQLAlchemy对追踪对象的修改并且发送信号
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # 操作数据库时显示原始SQL语句
    SQLALCHEMY_ECHO=True