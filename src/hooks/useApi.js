import React, { useState } from "react";

/**
 * @param {(...args) => Promise<any>} apiCall
 * The API call to make
 */
export const useApi = (apiCall, mapResponse = response => response) => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const makeFetch = async (...args) => {
    try {
      setIsFetching(true);
      const res = await apiCall(...args);
      const mappedResponse = mapResponse(res);
      setResponse(mappedResponse);
      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);
      setError(err);
    }
  };

  return { isFetching, error, response, makeFetch };
};
