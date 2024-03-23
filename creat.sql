# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 9:26
# @介绍    :

DROP DATABASE IF EXISTS safe_resume;
CREATE DATABASE IF NOT EXISTS safe_resume;
USE safe_resume;
# CREATE TABLE usersResource (
#     ETHAccounts VARCHAR(255) NOT NULL,
#     PrivateKeys VARCHAR(255) NOT NULL
# );
CREATE TABLE users (
    hashID VARCHAR(255) NOT NULL,
    ETHAccounts VARCHAR(255) NOT NULL,
    PublicKeys VARCHAR(255) NOT NULL,
    identity VARCHAR(50) NOT NULL,
    P VARCHAR(255) NOT NULL
);
CREATE TABLE usersEvents (
    hashID VARCHAR(255) NOT NULL,
    resume VARCHAR(255) NOT NULL,
    timestamp VARCHAR(255) NOT NULL,
    downloadtimes int NOT NULL
);
CREATE TABLE recruiter (
    username VARCHAR(255) NOT NULL,
    hashID VARCHAR(255) NOT NULL
);
CREATE TABLE recruiterEvent (
    username VARCHAR(255) NOT NULL,
    hashID VARCHAR(255) NOT NULL
);
CREATE TABLE KeyKeeper (
    hashID VARCHAR(255) NOT NULL
);