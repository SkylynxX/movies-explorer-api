require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routerIndex = require('./routes/index');
const cors = require('./middlewares/cors');
const errorJSON = require('./middlewares/error-json');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
mongoose.connect('mongodb://localhost:27017/moviedb', {
  useNewUrlParser: true,
});
app.use(cors);

app.use(bodyParser.json()); // подключение готового парсера для обработки запросов
app.use(requestLogger); // подключаем логгер запросов

app.use(routerIndex);

app.use(errorLogger);
app.use(errors());
app.use(errorJSON);
app.listen(PORT, () => {
  console.log(`Сервер запущен. доступен по адрессу http://localhost:${PORT}`);
});
