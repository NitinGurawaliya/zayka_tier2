import axios from "axios";
import type { HttpClient } from "./contracts";

export const defaultHttpClient: HttpClient = async (request) => {
  const response = await axios({
    method: request.method,
    url: request.url,
    data: request.data,
    headers: request.headers,
  });

  return {
    data: response.data,
    status: response.status,
  };
};
