const functions = require('firebase-functions');
const admin = require('firebase-admin');
const plaid = require('plaid');

admin.initializeApp(); // Initialize Firebase
console.log(plaid)
const plaidClient = new plaid.Client({
  clientID: "62b5f84bdd58cc0015bc7805",
  secret: "1ad83379118c98dcb3116bd77ccdd6",
  env: 'development' // 'sandbox', 'development', or 'production'
});



// Firebase Function to handle Plaid Link flow
exports.exchangePublicToken = functions.https.onRequest(async (req, res) => {
  const publicToken = req.body.public_token;

  try {
    const response = await plaidClient.exchangePublicToken(publicToken);
    const accessToken = response.access_token;

    // Store access_token securely (e.g., Firestore database associated with the user)
    await admin.firestore().collection('users').doc(userId).update({
      plaidAccessToken: accessToken
    });

    res.status(200).send('Success');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});
