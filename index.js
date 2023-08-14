module.exports.handler = async (event) => {
  console.log("EVENT HAS HAPPENED!");
  console.log("Event Info: " + JSON.stringify(event));
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
