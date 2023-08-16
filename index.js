let { DynamoDbClient } = require("@aws-sdk/client-dynamodb");
let { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const updateDynamoDb = async function (event) {
  let response = {
    statusCode: 200,
    body: JSON.stringify("Success"),
  };

  for (let key in event.records) {
    // Iterate through records
    event.records[key].map(async (record) => {
      const client = new DynamoDbClient({});
      const docClient = DynamoDBDocumentClient.from(client);
      const params = new PutCommand({
        Item: {
          message: Buffer.from(record.value, "base64").toString(),
        },
        TableName: "ordersTable",
      });
      try {
        const data = await docClient.send(params);
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
