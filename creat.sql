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
    hashID VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    publicKeys VARCHAR(255) NOT NULL,
    P VARCHAR(255) NOT NULL
);
CREATE TABLE Recruiter (
    userName VARCHAR(255) NOT NULL,
    hashID VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    publicKeys VARCHAR(255) NOT NULL,
    P VARCHAR(255) NOT NULL
);
CREATE TABLE KeyKeeper (
    userName VARCHAR(255) NOT NULL,
    hashID VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    publicKeys VARCHAR(255) NOT NULL,
    P VARCHAR(255) NOT NULL
);
CREATE TABLE resumeForm(
    hashID VARCHAR(255) NOT NULL,
    putTime  int NOT NULL,
    downloadtimes int NOT NULL
);