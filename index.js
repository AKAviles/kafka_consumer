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
    eachBatchAutoResolve: true,
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
      uncommittedOffsets,
      isRunning,
      isStale,
      pause,
    }) => {
      for (let message of batch.messages) {
        console.log({
          topic: batch.topic,
          partition: batch.partition,
          highWatermark: batch.highWatermark,
          message: {
            offset: message.offset,
            key: message.key.toString(),
            value: message.value.toString(),
            headers: message.headers,
          },
        });

        resolveOffset(message.offset);
        await heartbeat();
      }
    },
  });
  return { statusCode: 200 };
};
