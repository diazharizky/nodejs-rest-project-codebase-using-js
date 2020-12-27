const log = require('../../utils/log')

module.exports = () => {
  /**
   *
   * @param {Error} err
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  const f = (err, _, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    log.error({
      msg: err.message,
      error: err,
      stacktrace: err.stack
    })
    res.status(500).send('Internal server error.')
  }
  return f
}
