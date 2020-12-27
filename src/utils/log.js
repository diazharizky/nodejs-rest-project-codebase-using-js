exports = module.exports = require('pino')({
  name: 'nodejs-project-codebase',
  level: process.env.NODE_ENV === 'test' ? 'warn' : 'info',
  timestamp: () => {
    return `,"time":"${new Date().toISOString()}"`
  }
})
