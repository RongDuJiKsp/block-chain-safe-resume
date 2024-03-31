# -*- coding: UTF-8 -*-
# @Project : block-chain-safe-resume
# @File    : test.py
# @Author  : LtmThink
# @Date    : 2024/3/30 14:23
# @介绍    :

from settings import Configs
from eth_abi import decode

global config
config = Configs()

def test():
	data = "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000028d7d8b7fda00000000000000000000000000000000000000000000000000000b233182d27900000000000000000000000000000000000000000000000000000002f8c1e3b5"
	# 解码
	types = ['uint', 'uint', 'uint', 'uint']
	decoded_data = decode(types, bytes.fromhex(data[2:]))
	print(decoded_data)

if __name__ == '__main__':
	test()