const admin = require('firebase-admin');
const Web3 = require('web3');
const { recoverPersonalSignature } = require('eth-sig-util');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const isValidEthAddress = (address) => Web3.utils.isAddress(address);

const makeId = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const getMessageToSign = async (req, res) => {
  try {
    const { address } = req.query;

    if (!isValidEthAddress(address)) {
      return res.send({ error: 'invalid_address' });
    }

    const randomString = makeId(20);
    let messageToSign = `Wallet address: ${address} Nonce: ${randomString}`;

    // Get user data from firestore database
    const user = await admin.firestore().collection('users').doc(address).get();

    if (user.data() && user.data().messageToSign) {
      // messageToSign already exists for that particular wallet address
      messageToSign = user.data().messageToSign;
    } else {
      // messageToSign doesn't exist, save it to firestore database
      admin.firestore().collection('users').doc(address).set(
        {
          messageToSign,
        },
        {
          merge: true,
        }
      );
    }

    console.log('Message To Sign: ', messageToSign);
    return res.send({ messageToSign, error: null });
  } catch (error) {
    console.log(error);
    return res.send({ error: 'server_error' });
  }
};

const isValidSignature = (address, signature, messageToSign) => {
  if (!address || typeof address !== 'string' || !signature || !messageToSign) {
    return false;
  }

  const signingAddress = recoverPersonalSignature({
    data: messageToSign,
    sig: signature,
  });

  if (!signingAddress || typeof signingAddress !== 'string') {
    return false;
  }

  return signingAddress.toLowerCase() === address.toLowerCase();
};

const getJWT = async (req, res) => {
  try {
    const { address, signature } = req.query;

    if (!isValidEthAddress(address) || !signature) {
      return res.send({ error: 'invalid_parameters' });
    }

    const [customToken, doc] = await Promise.all([
      admin.auth().createCustomToken(address),
      admin.firestore().collection('users').doc(address).get(),
    ]);

    if (!doc.exists) {
      return res.send({ error: 'invalid_message_to_sign' });
    }

    const { messageToSign } = doc.data();

    if (!messageToSign) {
      return res.send({ error: 'invalid_message_to_sign' });
    }

    const validSignature = isValidSignature(address, signature, messageToSign);

    if (!validSignature) {
      res.send({ error: 'invalid_signature' });
    } else {
      admin.firestore().collection('users').doc(address).set(
        {
          messageToSign: null,
        },
        {
          merge: true,
        }
      );

      res.cookie('JWT', customToken);
      res.cookie('isLoggedIn', true);
    }

    console.log('JWT Connected: ', customToken);
    return res.send({ customToken, error: null });
  } catch (err) {
    console.log('Error:', err);
    return res.send({ error: 'server_error' });
  }
};

const reAuth = async (req, res, next) => {
  try {
    console.log('re-auth ran');

    // const { JWT } = req.cookies;
    // console.log(JWT);
    // const verifyJWT = await admin.auth().verifyIdToken(JWT);

    // console.log('verify JWT: ', verifyJWT);
    // can run a db query to check if it is a real user
    // if (user) res.cookie('isLoggedIn', true);
    // res.status(200).json({
    //   success: true,
    //   data: { firstName: 'Liam', lastName: 'Leung' },
    // });
  } catch (err) {
    console.log('reAuth Error: ', err);
    next(err);
  }
};

exports.getMessageToSign = getMessageToSign;
exports.getJWT = getJWT;
exports.reAuth = reAuth;
