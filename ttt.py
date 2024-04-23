# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : ttt.py
# @Author  : LtmThink
# @Date    : 2024/4/12 0:23
# @介绍    :
import rsa

# 生成新的公钥和私钥
pubkey_pem='''
-----BEGIN RSA PUBLIC KEY-----
MCgCIQDGuWSdEQc0aJFkLWA5FL1VIdvek+BNfxaL2BsM+e0MbQIDAQAB
-----END RSA PUBLIC KEY-----
'''
privkey_pem='''
-----BEGIN RSA PRIVATE KEY-----
MIGqAgEAAiEAxrlknREHNGiRZC1gORS9VSHb3pPgTX8Wi9gbDPntDG0CAwEAAQIg
faNUgyDy5yV9VlKB1VTQ1rgD9qxUt0+G5Lkg+i6oJNkCEgDkIZOh4Grwb5bpBXQb
S/QTQwIQAN8AKYiLNmKCT7tGjLrujwIRb9YGCdV6l2QdFx8VTExv2wECD0s//8Pu
zixRstwMQ4L06wIRLVonR9TM0SB8Q45hiPJ9n/0=
-----END RSA PRIVATE KEY-----
'''
# 从PEM格式的字符串中加载公钥和私钥
pubkey_loaded = rsa.PublicKey.load_pkcs1(pubkey_pem.encode())
privkey_loaded = rsa.PrivateKey.load_pkcs1(privkey_pem.encode())

# 使用加载的公钥和私钥加密和解密消息
message = '123456789'
message = message.encode()
crypto = rsa.encrypt(message, pubkey_loaded)
print(crypto)
message = rsa.decrypt(crypto, privkey_loaded)
print(message.decode())

