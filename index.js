const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "orders",
  brokers: ["pkc-n98pk.us-west-2.aws.confluent.cloud:9092"],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: "TVRLE5EIYD73XOGY",
    password:
      "/vrQg9tS263AQG+jd3SSXIRnbeEGJFYTOREE3PA2mj8VKwJDk9yBiqqVlzPB6jIr",
  },
});

const consumer = kafka.consumer({ groupId: "order-consumption" });

module.exports.handler = async (event) => {
  await consumer.connect();
  await consumer.subscribe({ topic: "orders" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
  return { statusCode: 200 };
};
