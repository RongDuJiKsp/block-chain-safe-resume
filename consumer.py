import pika

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
    print(" [x] Received %r" % body)
channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=True)
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
# 关闭连接
connection.close()