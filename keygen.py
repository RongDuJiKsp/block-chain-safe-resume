import os
from cryptography.fernet import Fernet

import random
import string

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


def generate_random_number(length):
    # 生成由数字0-9组成的字符串
    digits = string.digits
    # 从数字字符串中随机选择length个字符，生成随机字符串
    s = ''.join(random.choice(digits) for _ in range(length))
    s = int(s)
    return s


random_number = generate_random_number(32)
print(random_number)



def keygen(u_password):
    password_provided = u_password
    password = password_provided.encode()
    salt_s = b'\x91\xabr\xebx\xc5\x9dx^b_7\xb6\x8a\xbb5'
    salt_y = b'\x1cy8\r\x7f\xf8,\xe2Pu!/\x043\xdc\x0e'
    salt_z = b'\x9b\xd0\xb6\x85!J\xde\xe5\xc8\xb3\xc9\xa2\tqPy'

    kdf_s = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt_s,
        iterations=100000,
        backend=default_backend()
    )
    key_1 = (kdf_s.derive(password)).hex()

    kdf_y = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt_y,
        iterations=100000,
        backend=default_backend()
    )
    key_2 = (kdf_y.derive(password)).hex()

    kdf_z = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt_z,
        iterations=100000,
        backend=default_backend()
    )
    key_3 = (kdf_z.derive(password)).hex()

    # returns three base_64 encoded keys
    return key_1, key_2, key_3



