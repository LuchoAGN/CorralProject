import axios from 'axios'
var serverURI = 'https://corral-api.hygprueba.com/api'

export default {
  request (method, uri, data = null) {
    if (!method) {
      console.error('API function call requires method argument')
      return
    }

    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    var url = serverURI + uri

    return axios({
      method: method,
      url: url,
      data: data
    });
  }
}