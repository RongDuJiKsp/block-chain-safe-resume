# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : settings.py.py
# @Author  : LtmThink
# @Date    : 2024/3/17 8:40
# @介绍    :
import base64
import json
from settings import Configs
from asmuth_bloom import *
import pymysql
import requests
from eth_abi import decode
import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

global config
config = Configs()
conn = pymysql.connect(host=config.host, user=config.user, password=config.password, database=config.database,autocommit=True,charset='utf8')
cur = conn.cursor()
cur.execute('SET GLOBAL wait_timeout = 288000000')
cur.execute('SET GLOBAL interactive_timeout = 288000000')
cur.execute('set global max_allowed_packet = 288000000')


def verifyIdentity(identity):
    list = ["Applicant", "Recruiter", "KeyKeeper"]
    if identity in list:
        return 1
    else:
        return 0


def randName():
    return ''.join(random.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12))


def getKey(userName):
    url = config.WeBASE_privateKey_api + f'?type=2&appId=2&returnPrivateKey=True&signUserId={userName}'
    response = requests.get(url)
    key = response.json()
    privateKey = base64.b64decode(key['privateKey']).decode('utf-8')
    url2 = config.WeBASE_privateKey_api + f"/import?privateKey={privateKey}&userName={userName}"
    response2 = requests.get(url2)
    return key


def getTableName(identity):
    if identity == 'Applicant':
        return 'Applicant'
    elif identity == 'Recruiter':
        return 'Recruiter'
    elif identity == 'KeyKeeper':
        return 'KeyKeeper'
    else:
        return 'error'


def apiApkeysupload(address, onetmp,user):
    url = config.api_url
    config.api_data["user"] = address
    config.api_data["funcName"] = 'Apkeysupload'
    config.api_data["funcParam"] = [f'{onetmp}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        user['message'] = reslut['message']
        if reslut['status'] == "0x0":
            user['status'] = 1
            return user
        else:
            return user
    except Exception as e:
        user['message'] = "{}".format(str(e))
        return user

def apiFileUpdate(address,hash_code, file_name, file_type,upload):
    url = config.api_url
    config.api_data["user"] = address
    config.api_data["funcName"] = 'FileUpdate'
    config.api_data["funcParam"] = [f'{hash_code}', f'{file_name}', f'{file_type}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        upload['message'] = reslut['message']
        if reslut['status'] == "0x0":
            upload['status'] = 1
            return upload
        else:
            return upload
    except Exception as e:
        upload['message'] = "{}".format(str(e))
        return upload
def apiKeeperApply(KKAddress):
    url = config.api_url
    config.api_data["user"] = KKAddress
    config.api_data["funcName"] = 'KeeperApply'
    config.api_data["funcParam"] = []
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        message = reslut['message']
        if reslut['status'] == "0x0":
            return True,message
        else:
            return False,message
    except Exception as e:
        return False,str(e)

def apiReturnsubkey(ApAddress,KKAddress,part):
    url = config.api_url
    config.api_data["user"] = KKAddress
    config.api_data["funcName"] = 'Returnsubkey'
    config.api_data["funcParam"] = [f'{ApAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        part['message'] = reslut['message']
        if reslut['status'] == "0x0":
            #还需解析返回值
            part['status'] = 1
            types = ['uint', 'uint', 'uint', 'uint']
            decoded_data = decode(types, bytes.fromhex(reslut['output'][2:]))
            part['i'] = decoded_data[0]
            part['x'] = decoded_data[1]
            part['m'] = decoded_data[2]
            part['p'] = decoded_data[3]
            return part
        else:
            return part
    except Exception as e:
        part['message'] = "{}".format(str(e))
        return part

def apiRecRequest(ReAddress,ApAddress):
    url = config.api_url
    config.api_data["user"] = ReAddress
    config.api_data["funcName"] = 'RecRequest'
    config.api_data["funcParam"] = [f'{ReAddress}',f'{ApAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        message = reslut['message']
        if reslut['status'] == "0x0":
            return True,message
        else:
            return False,message
    except Exception as e:
        return False,str(e)

def apiAuthorizeUser(ApAddress, ReAddress):
    url = config.api_url
    config.api_data["user"] = ApAddress
    config.api_data["funcName"] = 'AuthorizeUser'
    config.api_data["funcParam"] = [f'{ReAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        message = reslut['message']
        if reslut['status'] == "0x0":
            return True,message
        else:
            return False,message
    except Exception as e:
        return False,str(e)

def apiDownloadResume(ReAddress,ApAddress,base):
    url = config.api_url
    config.api_data["user"] = ApAddress
    config.api_data["funcName"] = 'DownloadResume'
    config.api_data["funcParam"] = [f'{ReAddress}',f'{ApAddress}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        base['message'] = reslut['message']
        if reslut['status'] == "0x0":
            #还需解析返回值
            base['status'] = 1
            types = ['string', 'string', 'string']
            decoded_data = decode(types, bytes.fromhex(reslut['output'][2:]))
            #base['s'] = decoded_data[0]
            base['fileName'] = decoded_data[0]
            base['fileType'] = decoded_data[1]
            base['fileHash'] = decoded_data[2]
            return base
        else:
            return base
    except Exception as e:
        base['message'] = "{}".format(str(e))
        return base
def apiKeeperkeyjudge(KKAddress,ApAddress,i,x,m):
    url = config.api_url
    config.api_data["user"] = KKAddress
    config.api_data["funcName"] = 'KeeperkeysUpload'
    config.api_data["funcParam"] = [f'{ApAddress}',f'{i}',f'{x}',f'{m}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    try:
        message = reslut['message']
        if reslut['status'] == "0x0":
            # 还需解析返回值
            types = ['int']
            decoded_data = decode(types, bytes.fromhex(reslut['output'][2:]))
            return decoded_data[0],message
        else:
            return 1,message
    except Exception as e:
        return 1,str(e)

def apiBalance(address,base):
    url = config.api_url
    config.api_data["user"] = address
    config.api_data["funcName"] = 'balance'
    config.api_data["funcParam"] = [f'{address}']
    response = requests.post(url, json=config.api_data)
    reslut = response.json()
    base['status'] = 1
    base['balance'] = int(reslut[0])
    return base

def saveArray(X, M, P, address):
    tmp={}
    tmp['i']=0
    tmp['X']=X
    tmp['M']=M
    config.neeedSave[address]=tmp
    config.aleadySave[address]={}

def getFuckS(ApAddress):
    I=[]
    X=[]
    M=[]
    for i in range(0,5):
        if i in config.aleadySave[ApAddress]:
            I.append(i)
            X.append(config.aleadySave[ApAddress][i]['x'])
            M.append(config.aleadySave[ApAddress][i]['m'])
    # 删除
    del config.aleadySave[ApAddress]
    config.aleadySave[ApAddress]={}
    condition = f'select P from Applicant where address=%s;'
    cur.execute(condition, (ApAddress))
    P = cur.fetchone()[0]
    # 合成函数
    #
    #
    #
    #
    #

def RSAKeyGen():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=1024,
        backend=default_backend()
    )
    # 生成公钥
    public_key = private_key.public_key()
    # 将私钥转换为PEM格式
    pem_private_key = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    # 将公钥转换为PEM格式
    pem_public_key = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return pem_public_key.decode(),pem_private_key.decode()
def verifyprivateKeys(privateKey, identity, login):
    name = randName()
    url = config.WeBASE_privateKey_api + f'/import?privateKey={privateKey}&userName={name}'
    response = requests.get(url)
    key = response.json()
    if response.status_code == 200:
        table_name = getTableName(identity)
        if table_name == 'error':
            login['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
            return json.dumps(login)
        condition = f'select * from {table_name} where address=%s'
        cur.execute(condition, (key['address']))
        result = cur.fetchone()
        if result:
            login['status'] = 1
            login['message'] = "登录成功"
            login['userName'] = result[0]
            login['address'] = result[1]
            return json.dumps(login)
        else:
            return json.dumps(login)


def register(data, user):
    # T==S
    table_name = getTableName(data['identity'])
    if table_name == 'error':
        user['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
        return json.dumps(user)
    userName = randName()
    key = getKey(userName)
    # 插入用户信息
    try:
        if table_name == 'Applicant':
            need = getNeed()
            onetmp=[]
            for i in range(0,5):
                tmp=str(i)+str(need['X'][i])+str(need['M'][i])
                onetmp.append(hashlib.sha256(tmp.encode('utf-8')).hexdigest())

            user=apiApkeysupload(key["address"],onetmp,user)

            if user['status'] == 0:
                return json.dumps(user)
            condition = f"insert into {table_name}(userName,address,publicKeys,P) values(%s,%s,%s,%s);"
            cur.execute(condition, (userName, key["address"], key['publicKey'], need['P']))
            condition = f"insert into NeedSave(userName,address,remainingAmount) values(%s,%s,5);"
            cur.execute(condition, (userName, key["address"]))
            user['address'] = key["address"]
            user['privateKeys'] = key['privateKey']
            user['S'] = need['S']
            user['P'] = need['P']
            user['M'] = need['M']
            user['X'] = need['X']
            user['encryptPrivateKeys']=''
            return json.dumps(user)
        elif(table_name=='KeyKeeper'):
            public_key, private_key = RSAKeyGen()
            condition = f"insert into {table_name}(userName,address,publicKeys,P) values(%s,%s,%s,%s);"
            cur.execute(condition, (userName, key["address"], public_key, '222'))
            user['status'] = 1
            user['address'] = key["address"]
            user['privateKeys'] = key['privateKey']
            user['encryptPrivateKeys'] = private_key
            return json.dumps(user)
        else:
            condition = f"insert into {table_name}(userName,address,publicKeys,P) values(%s,%s,%s,%s);"
            cur.execute(condition, (userName, key["address"], key['publicKey'], '222'))
            user['status'] = 1
            user['address'] = key["address"]
            user['privateKeys'] = key['privateKey']
            user['encryptPrivateKeys'] = ''
            return json.dumps(user)
    except Exception as e:
        user['status'] = 0
        user['message'] = "{}".format(str(e))
        return json.dumps(user)


def uploadIpfs(file,userName, address, upload):
    files = {
        'file': (file.filename, file)
    }
    response = requests.post(config.ipfs_url_upload, files=files)
    # 简历信息上链
    if response.status_code == 200:
        data = json.loads(response.text)
        hash_code = data['Hash']
        upload=apiFileUpdate(address, hash_code, file.filename, file.content_type,upload)
        if(upload['status']==0):
            return json.dumps(upload)
        conn.ping()
        condition = f'select * from resumeForm where address=%s'
        cur.execute(condition, (address))
        if(cur.rowcount):
            condition = f'update resumeForm set putTime=UNIX_TIMESTAMP() where address=%s;'
            cur.execute(condition, (address))
        else:
            condition = f'insert into resumeForm(userName,address,putTime,downloadtimes) values(%s,%s,UNIX_TIMESTAMP(),0);'
            cur.execute(condition, (userName,address))
    else:
        return json.dumps(upload)
    upload['status'] = 1
    upload['message'] = '上传成功'
    upload['hash'] = hash_code
    return json.dumps(upload)


def getMoreFileMes(ApAddress, base):
    # 在hr表中
    # 查询resumeForm表所有内容
    condition = f'select * from resumeForm where address=%s'
    connn = pymysql.connect(host=config.host, user=config.user, password=config.password, database=config.database,autocommit=True, charset='utf8')
    curr = connn.cursor()
    curr.execute(condition, ApAddress)
    if curr.rowcount:
        result=curr.fetchone()
        base['status'] = 1
        base['userName'] = result[0]
        base['putTime'] = result[2]
        base['downloadtimes'] = result[3]
        return json.dumps(base)
    else:
        return json.dumps(base)


def downloadByipfs(file_hash,ApUserName,ReUserName,download):
    # 和合约交互获取文件哈希和文件名等
    file_name = "test"
    # 从ipfs处下载文件
    gateway_url = config.ipfs_url_download + f"{file_hash}?download=True&filename={file_name}"
    url = gateway_url + file_hash
    response = requests.get(url)
    # 返回
    if response.status_code == 200:
        # 保存到历史记录
        condition = f'insert into DownloadHisForm(ApUserName,ReUserName,downloadtime) values(%s,%s,UNIX_TIMESTAMP());'
        cur.execute(condition, (ApUserName, ReUserName))
        download['status'] = 1
        download['fileName'] = file_name
        download['base64'] = base64.b64encode(response.content).decode('utf-8')
        return download
    else:
        return download

def ChangeName(data, change):
    table_name = getTableName(data['identity'])
    if table_name == 'error':
        change['message'] = "identity不合法(支持的身份类型:Applicant,Recruiter,KeyKeeper)"
        return json.dumps(change)
    # 判断用户名是否已经存在
    condition = f"select * from {table_name} where userName=%s"
    cur.execute(condition, (data["oldName"]))
    if cur.fetchone():
        condition = f"update {table_name} set userName=%s where userName=%s"
        cur.execute(condition, (data['newName'], data['oldName']))
        if cur.rowcount:
            change['status'] = 1
            change['message'] = "修改成功"
            change['newName'] = data['newName']
            return json.dumps(change)
        else:
            return json.dumps(change)
    else:
        change['message'] = "用户名不存在"
        return json.dumps(change)
def getNeedSave(KKAddress,base):
    condition = f'select * from NeedSave where remainingAmount>0 and address not in (select ApAddress from KKAlreadySave where KKAddress=%s) ;'
    cur.execute(condition,(KKAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def SavePart(ApUserName,ApAddress,KKAddress,part):
    # part=apiReturnsubkey(ApAddress,KKAddress,part)
    # if part['status']==0:
    #     return json.dumps(part)
    if(config.neeedSave[ApAddress]['i']==4):
        del config.neeedSave[ApAddress]
        return json.dumps(part)
    condition = f'UPDATE NeedSave SET remainingAmount = remainingAmount - 1 where address=%s;'
    cur.execute(condition,(ApAddress))
    condition = f'insert into KKAlreadySave(ApUserName,ApAddress,KKAddress) values(%s,%s,%s);'
    cur.execute(condition,(ApUserName,ApAddress, KKAddress))
    part['status'] = 1
    part['i'] = config.neeedSave[ApAddress]['i']
    part['x'] = config.neeedSave[ApAddress]['X'][part['i']]
    part['m'] = config.neeedSave[ApAddress]['M'][part['i']]
    part['p'] = config.neeedSave[ApAddress]['P']
    config.neeedSave[ApAddress]['i'] += 1
    return json.dumps(part)

def getSave(KKAddress,base):
    condition = f'select * from KKAlreadySave where KKAddress=%s;'
    cur.execute(condition,(KKAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)


def getResume(ReAddress,base):
    condition = f'select * from resumeForm where address not in (select ApAddress from AlreadyResumeForm where ReAddress=%s) ;'
    cur.execute(condition,(ReAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

#请求授权查看简历
def recAuthorize(ApUserName,ApAddress,ReAddress):
    re,message= apiRecRequest(ReAddress,ApAddress)
    if re == False:
        return False,message
    #AlreadyResumeForm重复判断
    condition = f'select * from AlreadyResumeForm where ApAddress=%s and ReAddress=%s;'
    cur.execute(condition,(ApAddress,ReAddress))
    if cur.fetchone():
        return False,message
    condition = f'insert into AlreadyResumeForm(ApUserName,ApAddress,ReAddress,ststus,keyNum) values(%s,%s,%s,0,0);'
    cur.execute(condition, (ApUserName,ApAddress, ReAddress))
    return True,message

def recAlreadyAuthorizeReq(ReAddress,base):
    condition = f'select * from AlreadyResumeForm where ReAddress=%s;'
    cur.execute(condition,(ReAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def getRequest(address,base):
    condition = f'select AlreadyResumeForm.ApUserName,AlreadyResumeForm.ApAddress,Recruiter.userName,AlreadyResumeForm.ReAddress ,AlreadyResumeForm.ststus from AlreadyResumeForm join Recruiter on  Recruiter.address=AlreadyResumeForm.ReAddress  where AlreadyResumeForm.ApAddress=%s;'
    cur = conn.cursor()
    cur.execute(condition,(address))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def apAuthorize(ApAddress,ReAddress):
    re,message = apiAuthorizeUser(ApAddress, ReAddress)
    if re == False:
        return json.dumps({'status': 0, 'message': message})
    condition = f'update AlreadyResumeForm set ststus=1 where ApAddress=%s and ReAddress=%s;'
    cur.execute(condition, (ApAddress, ReAddress))
    return json.dumps({'status': 1, 'message': message})

#拒绝授权更新数据库
def rejectAuthorize(ApAddress,ReAddress):
    condition = f'DELETE FROM AlreadyResumeForm where ApAddress=%s and ReAddress=%s;'
    cur.execute(condition, (ApAddress, ReAddress))
    return json.dumps({'status': 1, 'message': '更新成功'})

def getFileMes(ApAddress, ReAddress,base):
    condition = f'select keyNum from AlreadyResumeForm where ApAddress=%s and ReAddress=%s;'
    cur.execute(condition,(ApAddress, ReAddress))
    result = cur.fetchone()
    if result[0]<3:
        base['status'] = 0
        base['message'] = '您还未获得三个及以上的秘密份额'
        return json.dumps(base)
    #获取S
    S=getFuckS(ApAddress)
    if(S==-1):
        base['status'] = 0
        base['message'] = '份额合成错误'
        return json.dumps(base)
    base['s']=S
    #这个接口不获取S了
    return apiDownloadResume(ReAddress,ApAddress,base)

def getDownloadHis(ApUserName,base):
    condition = f'select * from DownloadHisForm where ApUserName=%s;'
    cur.execute(condition,(ApUserName))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def searchAp(partApUserName,base):
    condition = f'select userName,address from Applicant where userName like %s;'
    cur.execute(condition,('%'+partApUserName+'%'))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def remindKK(KKAddress,base):
    condition = f'select * from needKEY where KKAddress=%s;'
    cur.execute(condition,(KKAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def uploadKey(KKAddress,ApUserName,i,x,m,base):
    condition = f'select address from Applicant where userName=%s;'
    cur.execute(condition,(ApUserName))
    ApAddress = cur.fetchone()[0]
    part,message= apiKeeperkeyjudge(KKAddress,ApAddress,i,hashlib.sha256(x.encode('utf-8')).hexdigest(),hashlib.sha256(m.encode('utf-8')).hexdigest())
    if part==0:
        condition = f'update AlreadyResumeForm set keyNum = keyNum+1 where ApAddress=%s;'
        cur.execute(condition, (ApAddress))
        tmp = {}
        tmp['x'] = x
        tmp['m'] = m
        config.aleadySave[ApAddress][i].update(tmp)
        base['status'] = 1
        base['message'] = message
        return json.dumps(base)
    else:
        base['status'] = 0
        base['message'] = message
        print("uploadKey get part")
        return json.dumps(base)
def changeKK(KKAddress,base):
    re,message=apiKeeperApply(KKAddress)
    base['message'] = message
    if re == False:
        return json.dumps(base)
    base['status'] = 1
    return json.dumps(base)

def getBalance(address,base):
    return apiBalance(address,base)

def updataNeedKEY(ApAddress):
    # 向kk发送获取请求
    condition = f'select ApUserName,KKAddress from KKAlreadySave where ApAddress=%s'
    cur.execute(condition, (ApAddress))
    result=cur.fetchall()
    for row in result:
        ApUserName= row[0]
        KKAddress = row[1]
        condition = f'insert into needKEY(ApUserName,KKAddress,time) values(%s,%s,UNIX_TIMESTAMP());'
        cur.execute(condition, (ApUserName, KKAddress))

def getAllKK(ApAddress,base):
    condition = f'select * from KeyKeeper where address not in (select KKAddress from KeyKeeper where ApAddress=%s);'
    cur.execute(condition,(ApAddress))
    result = cur.fetchall()
    base['status'] = 1
    base['list'] = result
    return json.dumps(base)

def PostOnekey(KKAddress,ApAddress,publicKeys,i,x,m,base):
    messageX = str(x).encode()
    messageM = str(m).encode()
    # 使用公钥进行加密
    ciphertextX = publicKeys.encrypt(
        messageX,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    ciphertextM = publicKeys.encrypt(
        messageM,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    ciphertextX=base64.b64encode(ciphertextX).decode('utf-8')
    ciphertextM=base64.b64encode(ciphertextM).decode('utf-8')
    condition = f'insert into APKKsaveKey(ApAddress,KKAddress,i,x,m) values(%s,%s,%d,%s,%s);'
    cur.execute(condition, (KKAddress,ApAddress,i,ciphertextX,ciphertextM))
    base['status'] = 1
    base['message'] = '上传成功'
    return json.dumps(base)


if __name__ == '__main__':
    base={"status":0,"message":""}
    print(apiDownloadResume("0x113baf7e26aef234df3acdedf13077b7bc41bdd0","0xbd3985298dc373145efa818473e4a4cfa5a32e7f"))