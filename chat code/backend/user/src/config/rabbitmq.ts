import amql from "amqplib";

let channel: amql.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amql.connect({
      protocol: "amqp",
      hostname: process.env.Rabbitmq_Host,
      port: 5672,
      username: process.env.Rabbitmq_Username,
      password: process.env.Rabbitmq_Password,
    });

    channel = await connection.createChannel();

<<<<<<< HEAD
    console.log("✅ connected to rabbitmq");
=======
    console.log("✅ connected to RABBITMQ");
>>>>>>> 4337f333da07bbe77f8faec4ed882a5c70a6d097
  } catch (error) {
    console.log("Failed to connect to rabbitmq", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("Rabbitmq channel is not initalized");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
