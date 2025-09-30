const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  // Set M-Pesa credentials from environment variables
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;  // Use environment variable for the consumer key
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;  // Use environment variable for the consumer secret
  const shortcode = process.env.MPESA_SHORTCODE;  // Your M-Pesa Till number (use environment variable for this)
  const passkey = process.env.MPESA_PASSKEY;  // Passkey for STK push (use environment variable for this)
  const phone = event.body.phone;  // Customer's phone number

  // Step 1: Get access token from Safaricom
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: { Authorization: `Basic ${auth}` }
  });

  // Log token response for debugging
  const tokenData = await tokenRes.json();
  console.log('Token response:', tokenData);  // Log token response

  const access_token = tokenData.access_token;

  // Step 2: Prepare the STK Push request
  const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "").slice(0, 14);
  const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

  // Step 3: Send STK Push to Safaricom's API
  const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: event.body.amount,  // Amount to be paid (dynamic)
      PartyA: phone,  // Customer's phone number
      PartyB: shortcode,  // Your shortcode
      PhoneNumber: phone,  // Customer's phone number
      CallBackURL: "https://68d4e0ef8ccd4db2613d3ff3--heartfelt-marigold-32bb39.netlify.app/.netlify/functions/callback",  // Callback URL to your Netlify function
      AccountReference: event.body.account_reference || "Test123",  // Dynamic reference
      TransactionDesc: event.body.transaction_desc || "Payment Test"  // Dynamic description
    })
  });

  const stkData = await stkRes.json();

  // Log Safaricom response for debugging
  console.log('Safaricom STK Push response:', stkData);  // Log Safaricom response

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",  // Allow all origins (or restrict for security)
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }

  // Check if STK Push request was successful
  if (!stkRes.ok) {
    console.error("Error details:", stkData);  // Log the error from Safaricom API
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to process STK push", details: stkData })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(stkData)
  };
};
