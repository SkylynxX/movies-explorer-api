require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const routerIndex = require('./routes');
const cors = require('./middlewares/cors');
const errorJSON = require('./middlewares/error-json');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017' } = process.env;

const app = express();
// Apply the rate limiting middleware to all requests
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(helmet());
mongoose.connect(DB_ADDRESS.concat('/moviesdb'), {
  useNewUrlParser: true,
});
app.use(cors);

app.use(bodyParser.json()); // подключение готового парсера для обработки запросов

app.use(routerIndex);

app.use(errorLogger);
app.use(errors());
app.use(errorJSON);
app.listen(PORT, () => {
  console.log(`Сервер запущен. доступен по адрессу http://localhost:${PORT}`);
});
