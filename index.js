const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "orders",
  brokers: ["pkc-n98pk.us-west-2.aws.confluent.cloud:9092"],
});

const consumer = kafka.consumer({ groupId: "order-consumption" });

module.exports.handler = async (event) => {
  console.log("EVENT HAS HAPPENED!");
  console.log("Event Info: " + JSON.stringify(event));
  await consumer.connect();
  await consumer.subscribe({ topic: "orders", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Received Event: " + event,
        input: event,
      },
      null,
      2
    ),
  };
};
