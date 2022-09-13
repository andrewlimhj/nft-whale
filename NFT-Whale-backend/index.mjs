import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import pkg from 'ngrok';

import AuthRouter from './routes/auth.routes.mjs';
import NftRouter from './routes/nft.routers.mjs';

import errorMiddleware from './middlewares/error.middleware.mjs';

const ngrok = pkg;

const corsOptions = {
  origin: 'https://nft-whales.web.app',
  credentials: true,
};

const PORT = 3004;
const envFilePath = '.env';
dotenv.config({ path: path.normalize(envFilePath) });

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('dist'));
app.use(cors(corsOptions));

const routers = [AuthRouter, NftRouter];
routers.forEach((router) => app.use('/', router));

app.use(errorMiddleware);
app.set('trust proxy', true);

app.listen(PORT);
console.log(`🚀 App listening on the port ${PORT}`);

ngrok.connect(
  {
    proto: 'http',
    addr: process.env.PORT,
  },
  (err, url) => {
    if (err) {
      console.error('Error while connecting Ngrok', err);
      return new Error('Ngrok Failed');
    }
  }
);
// const url = ngrok.connect(8080);
// console.log(url);
