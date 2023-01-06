import path from 'path';
import express from 'express';
import morgan from 'morgan';
import * as logger from '../logger';
import Api from './routes';

const app = express();

const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(format, { stream: logger.stream }));
app.use(express.json());

app.use('/img', express.static(path.join(__dirname, './images')));

app.use('/api', Api);


if (process.env.NODE_ENV === 'production') {
  const wwwDir = path.join(__dirname, '../../../frontend/dist');

  app.get('/', (req, res, next) => {
    res.sendFile(path.join(wwwDir, 'index.html'));
  });

  app.use(express.static(wwwDir));

  app.all('*', (req, res, next) => {
    res.sendFile(path.join(wwwDir, 'index.html'));
  });
}

export default app;
