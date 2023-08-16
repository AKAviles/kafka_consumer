let AWS = require("aws-sdk");

const updateDynamoDb = async function (event) {
  let response = {
    statusCode: 200,
    body: JSON.stringify("Success"),
  };

  for (let key in event.records) {
    // Iterate through records
    event.records[key].map(async (record) => {
      const client = new AWS.DynamoDb.DocumentClient({ region: "us-east-1" });
      const params = {
        Item: {
          message: Buffer.from(record.value, "base64").toString(),
        },
        TableName: "ordersTable",
      };
      try {
        const data = await client.put(params).promise();
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
