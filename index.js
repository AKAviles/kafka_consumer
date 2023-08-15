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
  console.log("inside handler");
  await consumer.connect();
  await consumer.subscribe({ topics: ["orders"] });
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}#${message.value}`);
    },
  });
  return { statusCode: 200 };
};
