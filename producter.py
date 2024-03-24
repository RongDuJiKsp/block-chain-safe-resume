import pika

# 创建连接参数
credentials = pika.PlainCredentials('test', 'test')
parameters = pika.ConnectionParameters('47.97.255.9', 5672, '/', credentials)

# 创建连接
connection = pika.BlockingConnection(parameters)

# 创建通道
channel = connection.channel()

# 声明队列
queue = 'test_queue'
channel.queue_declare(queue=queue)

# 发送消息
message = 'Hello, RabbitMQ!'
channel.basic_publish(exchange='', routing_key=queue, body=message)
print(" [x] Sent %r" % message)

# 接收消息
def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)

channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()

# 关闭连接
connection.close()
