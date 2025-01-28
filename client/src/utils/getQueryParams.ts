// Function to get query parameters from the URL
const getQueryParams = (queryString: string) => {
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("token"); // Get the 'token' query param
};

export default getQueryParams;
