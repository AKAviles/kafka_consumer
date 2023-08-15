const { Kafka } = require("kafkajs");

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: "output-topic",
  brokers: ["pkc-n98pk.us-west-2.aws.confluent.cloud:9092"],
  ssl: true,
  logLevel: 2,
  sasl: {
    mechanism: "plain",
    username: "TVRLE5EIYD73XOGY",
    password:
      "/vrQg9tS263AQG+jd3SSXIRnbeEGJFYTOREE3PA2mj8VKwJDk9yBiqqVlzPB6jIr",
  },
});

const consumer = kafka.consumer({ groupId: "test-output" });

const run = async () => {
  //Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "output-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

module.exports.handler = async (event) => {
  run().catch(console.error);
};
