import pika

# 创建连接参数
credentials = pika.PlainCredentials('admin', 'admin')
parameters = pika.ConnectionParameters('47.97.255.9', 5672, 'test1', credentials)
# 创建连接
connection = pika.BlockingConnection(parameters)
# 创建通道
channel = connection.channel()
# 声明队列
queue = 'app_001'
channel.queue_declare(queue=queue, durable=True)
# 发送消息
message = 'Hello, RabbitMQ!'
channel.basic_publish(exchange='', routing_key=queue, body=message)
print(" [x] Sent %r" % message)
connection.close()