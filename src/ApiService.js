class ApiService {
  static async makeApiCall (url, method, payload, token, pathVariable, params) {
    try {
      if (pathVariable != null) {
        url = url + '/' + pathVariable
      }
      if (params != null) {
        url = url + '?' + params
      }
      const headers = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      let body = null
      if (payload) {
        body = JSON.stringify(payload)
      }

      const requestOptions = {
        method,
        headers
      }

      if (method !== 'GET' && method !== 'HEAD') {
        requestOptions.body = body
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        let errorData
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json()
        } else {
          errorData = await response.text()
        }
        throw new Error(errorData || 'Request failed')
      }

      let result
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        result = await response.text()
      }

      return { success: true, data: result, error: null }
    } catch (error) {
      console.error('Error occurred during API call:', error)
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  }
}

export default ApiService
