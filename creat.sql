# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 9:26
# @介绍    :

DROP DATABASE IF EXISTS safe_resume;
CREATE DATABASE IF NOT EXISTS safe_resume;
USE safe_resume;

CREATE TABLE Applicant (
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    publicKeys VARCHAR(255) NOT NULL,
    P VARCHAR(255) NOT NULL
);

CREATE TABLE Recruiter (
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    publicKeys VARCHAR(255) NOT NULL,
    P VARCHAR(255) NOT NULL
);

CREATE TABLE KeyKeeper (
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    publicKeys VARCHAR(2048) NOT NULL,
    P VARCHAR(255) NOT NULL
);

# 1.kk和ap
# 可供选择的秘密份额
CREATE TABLE NeedSave (
    userName VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    remainingAmount int NOT NULL
);

# kk已经保管的秘密份额
CREATE TABLE KKAlreadySave (
    ApUserName VARCHAR(255) NOT NULL,
    ApAddress VARCHAR(255) NOT NULL,
    KKAddress VARCHAR(255) NOT NULL
);

# 2.hr和ap
# 简历表
CREATE TABLE resumeForm(
    userName VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    putTime  int NOT NULL,
    downloadtimes BIGINT NOT NULL
);

# 申请中和已经录取的表,等待0,接受1
CREATE TABLE AlreadyResumeForm(
    ApUserName VARCHAR(255) NOT NULL,
    ApAddress VARCHAR(255) NOT NULL,
    ReAddress VARCHAR(255) NOT NULL,
    ststus int NOT NULL,
    keyNum int NOT NULL
);

CREATE TABLE DownloadHisForm(
    ApUserName VARCHAR(255) NOT NULL,
    ReUserName VARCHAR(255) NOT NULL,
    downloadtime BIGINT NOT NULL
);

CREATE TABLE needKEY(
    ApUserName VARCHAR(255) NOT NULL,
    KKAddress VARCHAR(255) NOT NULL,
    time BIGINT NOT NULL
);

CREATE TABLE APKKsaveKey(
    ApAddress VARCHAR(255) NOT NULL,
    KKAddress VARCHAR(255) NOT NULL,
    i VARCHAR(255) NOT NULL,
    x VARCHAR(255) NOT NULL,
    m VARCHAR(255) NOT NULL
);

CREATE TABLE Authentication(
    ApAddress VARCHAR(255) NOT NULL,
    KKUserName VARCHAR(255) NOT NULL
);


insert into KeyKeeper(userName,password,address,publicKeys,P) values('kkone','123456','0xb045a2b2919de75a5bf89bbcd1e57ae3b4c469ff','-----BEGIN RSA PUBLIC KEY-----
MCgCIQCNrIv2x6ZjpnfmKWOaFBFnlY3Z2Usti0SfMCrX85oOYwIDAQAB
-----END RSA PUBLIC KEY-----
','222');
insert into KeyKeeper(userName,password,address,publicKeys,P) values('kktwo','123456','0xc40dc21473ff6176583df3bed1669422ae0eef0b','-----BEGIN RSA PUBLIC KEY-----
MCgCIQCNrIv2x6ZjpnfmKWOaFBFnlY3Z2Usti0SfMCrX85oOYwIDAQAB
-----END RSA PUBLIC KEY-----
','222');
insert into KeyKeeper(userName,password,address,publicKeys,P) values('kkthree','123456','0x1dedc512ca27fa9b97cf8409505ecf248b21bace','-----BEGIN RSA PUBLIC KEY-----
MCgCIQCNrIv2x6ZjpnfmKWOaFBFnlY3Z2Usti0SfMCrX85oOYwIDAQAB
-----END RSA PUBLIC KEY-----
','222');