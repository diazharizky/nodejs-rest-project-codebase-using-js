const https = require('https')
const Axios = require('axios')

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'

class RequestError extends Error {
  /**
   *
   * @param {string} message
   * @param {(number|string)} code
   */
  constructor (message, code) {
    super(message)
    this.code = code
  }
}

class Request {
  /**
   *
   * @param {string} serviceName Name as identifier for every service which use this utility.
   * @param {import('axios').AxiosRequestConfig} conf
   */
  constructor (serviceName, conf) {
    /**
     *
     * @type {import('axios').AxiosInstance}
     */
    this.client = Axios.default.create(conf)
    this.serviceName = serviceName
    this.Error = RequestError
  }

  /**
   *
   * @param {Error} err
   */
  setError (err) {
    this.Error = err
  }

  /**
   *
   * @param {import('axios').AxiosRequestConfig} conf
   * @returns {Promise<Error, *>}
   */
  async request (conf) {
    const agent = new https.Agent({ rejectUnauthorized: false })
    conf.httpsAgent = agent
    conf.headers = conf.headers || {}
    let err, res
    try {
      res = await this.client.request(conf)
    } catch (e) {
      err = new this.Error(e)
      if (e.response) {
        err.code = e.response.status
        err.message = e.response.data
      } else if (e.request) {
        err.code = 500
        err.message = 'The request was made but no response was received'
      } else {
        err.code = 500
      }
    }
    return [err, !res ? null : res.data]
  }

  /**
   *
   * @param {string} path
   * @param {import('axios').AxiosRequestConfig} conf
   */
  get (path, conf) {
    /**
     *
     * @type {import('axios').AxiosRequestConfig}
     */
    let finalConf = {
      method: GET,
      url: path
    }
    finalConf = !conf ? finalConf : { ...finalConf, ...conf }
    return this.request(finalConf)
  }

  /**
   *
   * @param {string} path
   * @param {(JSON|string)} payload
   * @param {import('axios').AxiosRequestConfig} conf
   */
  post (path, payload, conf) {
    /**
     *
     * @type {import('axios').AxiosRequestConfig}
     */
    let finalConf = {
      method: POST,
      url: path,
      data: payload
    }
    finalConf = !conf ? finalConf : { ...finalConf, ...conf }
    finalConf.headers = finalConf.headers || {}
    if (!finalConf.headers['Content-Type']) {
      if (typeof payload === 'string') {
        finalConf.headers = {
          ...finalConf.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      } else if (typeof payload === 'object') {
        finalConf.headers = {
          ...finalConf.headers,
          'Content-Type': 'application/json'
        }
      }
    }
    return this.request(finalConf)
  }

  /**
   *
   * @param {string} path
   * @param {(JSON|string)} payload
   * @param {import('axios').AxiosRequestConfig} conf
   */
  put (path, payload, conf) {
    /**
     *
     * @type {import('axios').AxiosRequestConfig}
     */
    let finalConf = {
      method: PUT,
      url: path,
      data: payload
    }
    finalConf = !conf ? finalConf : { ...finalConf, ...conf }
    finalConf.headers = finalConf.headers || {}
    if (!finalConf.headers['Content-Type']) {
      if (typeof payload === 'string') {
        finalConf.headers = {
          ...finalConf.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      } else if (typeof payload === 'object') {
        finalConf.headers = {
          ...finalConf.headers,
          'Content-Type': 'application/json'
        }
      }
    }
    return this.request(finalConf)
  }

  /**
   *
   * @param {string} path
   * @param {import('axios').AxiosRequestConfig} conf
   */
  del (path, conf) {
    /**
     *
     * @type {import('axios').AxiosRequestConfig}
     */
    let finalConf = {
      method: DELETE,
      url: path
    }
    finalConf = !conf ? finalConf : { ...finalConf, ...conf }
    return this.request(finalConf)
  }
}

module.exports = Request
