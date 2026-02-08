import amqp from "amqplib";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.Rabbitmq_Host,
      port: 5672,
      username: process.env.Rabbitmq_Username,
      password: process.env.Rabbitmq_Password,
    });

    const channel = await connection.createChannel();
    const queueName = "send-otp";

    await channel.assertQueue(queueName, { durable: true });

    console.log("✅ Mail Service consumer started, listening for otp emails");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const { to, subject, body } = JSON.parse(msg.content.toString());

          await resend.emails.send({
            from: "Chat App <onboarding@resend.dev>",
            to,
            subject,
            text: body,
          });

          console.log(`✅ OTP mail sent to ${to}`);
          channel.ack(msg);
        } catch (error) {
          console.error("❌ Failed to send otp:", error);
        }
      }
    });
  } catch (error) {
    console.error("❌ Failed to start RabbitMQ consumer:", error);
  }
};
