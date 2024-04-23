import base64

import rsa

# 生成私钥
encryptPrivateKeys='''
-----BEGIN RSA PRIVATE KEY-----
MIGsAgEAAiEA0CNf+7+JR5AjW3e3LIts7TuOARAXQz/xo0WVp2DZ1YUCAwEAAQIh
AIc3dBPIyxaCvXWewJFfwjczOwrQLbDzUsWfMGm9rtnBAhIA8YaVsot5HZn+A/Tp
9U0PdkcCEADcnJGN4bjJC9JqB86RX9MCEgC2tEB5l9g+9EabZ6Gz1l9j8QIPJwOx
YgwXJ8blcUbsKx1tAhEUWqy0lVDmHcSUmG2PlLjkIQ==
-----END RSA PRIVATE KEY-----
'''
private_key = rsa.PrivateKey.load_pkcs1(encryptPrivateKeys.encode())
x = base64.b64decode('zrGuhX66TV5IZBswU9loQxSErGbEplD53oznfYlUIno=')
print(x)
m = base64.b64decode('CqsAbOQJ2l1go7+VlOF80H/XLG1Jtj/x2AKw6MQHHfI=')
print(m)
messageX = rsa.decrypt(x, private_key)
messageM = rsa.decrypt(m, private_key)
print(messageX)
