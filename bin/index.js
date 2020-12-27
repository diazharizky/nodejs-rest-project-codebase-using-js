const os = require('os')
const cluster = require('cluster')
const config = require('config')
const app = require('../app')
const log = require('../src/utils/log')
const clusterWorkerSize = os.cpus().length
const host = config.get('listen_host')
const port = config.get('listen_port')

module.exports = (() => {
  if (clusterWorkerSize <= 1 || !cluster.isMaster) {
    app.listen(port, host, () =>
      log.info({ msg: 'service_started', host, port })
    )
  } else {
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker) => {
      console.log('Worker', worker.id, 'has exitted.')
    })
  }
})()
