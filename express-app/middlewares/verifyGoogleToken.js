const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (req, res, next) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    req.googlePayload = ticket.getPayload();
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

module.exports = verifyGoogleToken;
