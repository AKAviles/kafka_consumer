module.exports.handler = async (event) => {
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
