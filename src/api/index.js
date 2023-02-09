import axios from 'axios'
var serverURI = 'http://192.168.10.3:8000/api'

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
      method,
      url,
      data
    });
  },
  requestH(method, uri, headers) {
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
      method,
      url,
      headers
    });
  },
  requestOH(method, uri, data, headers) {
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
      method,
      url,
      data,
      headers
    });
  }
}