const { config, DynamoDb } = require("aws-sdk");
const Promise = require("bluebird");

config.setPromisesDependency(Promise);

const updateDynamoDb = async function (event) {
  config.update({ region: "us-east-1" });
  let response = {
    statusCode: 200,
    body: JSON.stringify("Success"),
  };

  for (let key in event.records) {
    console.log("Key: ", key);
    // Iterate through records
    event.records[key].map(async (record) => {
      console.log("Record: ", record);
      const payload = record.body;
      const params = {
        Item: {
          message: Buffer.from(record.value, "base64").toString(),
        },
        TableName: "figure it out",
      };
      console.log(params);
      const documentClient = new DynamoDb.documentClient();
      try {
        const data = await documentClient.put(params).promise();
        console.log(`Database successfully updated. Returned ${data}`);
      } catch (err) {
        if (err) {
          console.log(err, err.stack);
          response = {
            statusCode: 500,
            body: "Error occurred while updating database",
          };
        }
      }
    });
  }
  return response;
};

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  return updateDynamoDb(event);
};
