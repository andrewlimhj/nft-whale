import Web3 from 'web3';
import { React, useState, useEffect } from 'react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
import axios from 'axios';

import ConnectWalletButton from '../components/ConnectWalletButton.js';
import mobileCheck from '../helpers/mobileCheck.js';
import getLinker from '../helpers/deepLink.js';

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'nft-whales.firebaseapp.com',
  projectId: 'nft-whales',
  storageBucket: 'nft-whales.appspot.com',
  messagingSenderId: '977502004537',
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

const ConnectWallet = () => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  try {
    useEffect(() => {
      // const reAuth = axios.get('http://localhost:3004/re-auth');

      // console.log(reAuth);

      // const fireBaseAuth = auth.Auth.currentUser;

      console.log('current user: ', auth.currentUser);
    });
  } catch (error) {
    console.log(error);
  }

  const onPressConnect = async () => {
    setLoading(true);

    try {
      const webUrl = 'https://nft-whales.web.app'; // Replace with your website domain
      const deepLink = `https://metamask.app.link/dapp/${webUrl}`;
      const downloadMetamaskUrl = 'https://metamask.io/download.html';

      if (window?.ethereum?.isMetaMask) {
        // Desktop browser
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        const account = Web3.utils.toChecksumAddress(accounts[0]);
        // setAddress(account);
        await handleLogin(account);
      } else if (mobileCheck()) {
        // Mobile browser
        const linker = getLinker(downloadMetamaskUrl);
        linker.openURL(deepLink);
      } else {
        window.open(downloadMetamaskUrl);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleLogin = async (address) => {
    const baseUrl = 'https://448a-77-58-87-115.ngrok.io';
    const response = await axios.get(`${baseUrl}/message?address=${address}`);
    const messageToSign = response?.data?.messageToSign;

    if (!messageToSign) {
      throw new Error('Invalid message to sign');
    }

    const web3 = new Web3(Web3.givenProvider);
    const signature = await web3.eth.personal.sign(messageToSign, address);

    const jwtResponse = await axios.get(
      `${baseUrl}/jwt?address=${address}&signature=${signature}`
    );

    console.log(jwtResponse);

    const customToken = jwtResponse?.data?.customToken;

    if (!customToken) {
      throw new Error('Invalid JWT');
    }

    await signInWithCustomToken(auth, customToken);
    setAddress(address);
    console.log('Address: ', address);
  };

  const onPressLogout = () => {
    setAddress('');
    signOut(auth);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <ConnectWalletButton
          onPressConnect={onPressConnect}
          onPressLogout={onPressLogout}
          loading={loading}
          address={address}
        />
      </header>
    </div>
  );
};

export default ConnectWallet;
