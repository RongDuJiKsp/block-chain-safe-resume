import json
import pika
from web3 import Web3
from eth_abi import decode

# ########################## consumer ##########################
credentials = pika.PlainCredentials('admin', 'admin')
parameters = pika.ConnectionParameters('47.97.255.9', 5672, 'test1', credentials)
# 创建连接
connection = pika.BlockingConnection(parameters)
# 创建通道
channel = connection.channel()
# 声明队列
queue = 'app_001'
channel.queue_declare(queue=queue,durable=True)
# 接收消息
def callback(ch, method, properties, body):
    print(body)
    # 解码字节串为字符串
    str_json = body.decode('utf-8')
    # 解析 JSON 数据
    json_obj = json.loads(str_json)
    # 获取 "data" 字段
    data = json_obj['logs'][0]['data']
    function_abi_types = ['address', 'uint256']  # ABI中函数的参数类型
    # 解码
    types = ['address', 'address', 'uint256', 'string']
    decoded_data = decode(types, bytes.fromhex(data[2:]))
    print(decoded_data)

channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=True)
channel.start_consuming()
# 关闭连接
connection.close()