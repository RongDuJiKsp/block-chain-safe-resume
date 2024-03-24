import pika

# ########################## consumer ##########################

connection = pika.BlockingConnection(pika.ConnectionParameters(
    host='47.97.255.9'))
channel = connection.channel()


# create queue
# channel.queue_declare(queue='queue_get_pics')

def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)


channel.basic_consume(
    'queue_get_pics',
    # no_ack=True,
    callback
)

print('[*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
