import axios, { AxiosError, Method } from "axios";
import { useState } from "react";

// a hook to handle request a lil more gracefully

interface useRequestParams {
  url: string;
  method: Method;
  body?: any;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  onSuccess?: (value?: any) => void;
}
interface RequestError {
  message: string;
}

export default function useRequest() {
  const [requestErrors, setRequestErrors] = useState<RequestError[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendRequest = async ({
    url,
    method,
    headers,
    body,
    withCredentials,
    onSuccess,
  }: useRequestParams) => {
    try {
      setRequestErrors(null);
      setIsLoading(true);
      const response = await axios({
        url,
        method,
        headers,
        data: body,
        withCredentials,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError)
        setRequestErrors(err.response?.data.errors);
      else setRequestErrors([{ message: "Some Error Occured" }]);
    }
    setIsLoading(false);
  };

  return { requestErrors, sendRequest, isLoading };
}
