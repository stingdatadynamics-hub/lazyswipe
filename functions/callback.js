exports.handler = async (event, context) => {
  // Safaricom will send the payment details here in the body of the POST request
  const paymentData = JSON.parse(event.body);

  // Log the payment data for debugging
  console.log("Payment Confirmation Data: ", paymentData);

  // Example: Process the payment result
  if (paymentData.ResultCode === 0) {
    // Handle success - for example, update the order status to 'paid'
    console.log("Payment Successful: ", paymentData);
    // You can add your code to update a database, send a success email, or notify the user.
  } else {
    // Handle failure - for example, update the order status to 'failed'
    console.log("Payment Failed: ", paymentData);
    // You can add your code to notify the user or handle the failure.
  }

  // Respond to Safaricom to acknowledge the callback
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Callback received successfully" })
  };
};
