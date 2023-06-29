class ApiService {
  static async makeApiCall(url, method, payload, token) {
    try {
      const headers = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Request failed");
      }
      const result = await response.json()
      return { success: true, data: result, error: null }
    } catch (error) {
      console.error("Error occurred during API call:", error)
      return { success: false, data: null, error: "An error occurred during the API call" };
    }
  }
}

export default ApiService;