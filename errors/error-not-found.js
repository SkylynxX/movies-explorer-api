class ErrorNotFound extends Error {
  constructor(message = 'Страница не найдена') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = ErrorNotFound;
