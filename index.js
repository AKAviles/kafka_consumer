const aws = require("aws-sdk");
const Promise = require("bluebird");

aws.config.setPromisesDependency(Promise);

const updateDynamoDb = async function (event) {
  console.log("AWS WASSSSUP:" + JSON.stringify(aws));
  aws.config.update({ region: "us-east-1" });
  let response = {
    statusCode: 200,
    body: JSON.stringify("Success"),
  };

  for (let key in event.records) {
    // Iterate through records
    event.records[key].map(async (record) => {
      const payload = record.body;
      const params = {
        Item: {
          message: Buffer.from(record.value, "base64").toString(),
        },
        TableName: "ordersTable",
      };
      const ddb = new aws.DynamoDb();
      console.log("Document Client:" + JSON.stringify(ddb));
      try {
        const data = ddb.putItem(params);
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
