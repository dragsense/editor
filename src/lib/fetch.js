// Fetcher function to handle API calls
export const fetcher = (...args) => {
  // Use fetch API to make the request
  return fetch(...args).then(async (response) => {
    let data;
    try {
      // If status is 204 (No Content), return null
      if (response.status === 204) return null;
      // Otherwise, parse the response to JSON
      data = await response.json();
    } catch (error) {
      // If parsing fails, return a rejected Promise with the error
      return Promise.reject(error);
    }
    // If response is OK, return the data
    if (response.ok) {
      return data;
    } else {
      // If response is not OK, return a rejected Promise with the error message
      return Promise.reject(data?.error || new Error(data?.message || 'Something went wrong'));
    }
  });
};

// This function creates an API request with the given endpoint, method, and body
// It uses the autocode API to get the project details and constructs the request URL and headers
// The request is then sent using the fetcher function
export const createApiRequest = async (endpoint, method = 'GET', body = null, isJson = true) => {
  // Fetch project details from autocode API
  const res = await window.autocode.makeApiRequest();

  // Throw an error if project is not found
  if (!res.project) {
    throw new Error("Project Not Found.");
    return;
  }

  const { url, apikey } = res.project;

  // Construct the request URL by appending the endpoint to the project URL
  // The regex is used to remove any duplicate slashes in the URL
  const requestUrl = `${url}/${endpoint}`.replace(/([^:]\/)\/+/g, '$1');

  // Construct the request options
  const requestOptions = {
    method,
    headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
  };

  // If a body is provided, add it to the request options
  if (body) {
    if (isJson) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    else
      requestOptions.body = body;

  }

  // Send the request using the fetcher function
  return fetcher(requestUrl, requestOptions);
};