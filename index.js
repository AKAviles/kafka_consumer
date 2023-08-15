const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  clientId: "output-topic",
  brokers: ["pkc-n98pk.us-west-2.aws.confluent.cloud:9092"],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: "TVRLE5EIYD73XOGY",
    password:
      "/vrQg9tS263AQG+jd3SSXIRnbeEGJFYTOREE3PA2mj8VKwJDk9yBiqqVlzPB6jIr",
  },
});

const consumer = kafka.consumer({ groupId: "output-consumption" });

module.exports.handler = async (event) => {
  console.log("inside handler");
  await consumer.connect();
  await consumer.subscribe({ topics: ["output-topic"] });
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      msgNumber++;
      kafka.logger().info("Message processed", {
        topic,
        partition,
        offset: message.offset,
        timestamp: message.timestamp,
        headers: Object.keys(message.headers).reduce(
          (headers, key) => ({
            ...headers,
            [key]: message.headers[key].toString(),
          }),
          {}
        ),
        key: message.key.toString(),
        value: message.value.toString(),
        msgNumber,
      });
    },
  });
};
