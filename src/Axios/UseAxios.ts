import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";

export { };

const MAXIMUM_DELAY: number = 500;

export const config = (requestUrl: string,methodType: any, data?: any ): AxiosRequestConfig => {
  return {
    method: methodType,
    url: requestUrl,
    headers: { "Content-Type": "application/json"},
    data: JSON.stringify(data),
    responseType: "json"
  }
};

export interface IRequestData {
    url: string;
    params?: any;
}

export interface IAxiosResult<T> {
    Data: T;
    IsLoading: boolean;
    Errors: string;
}
 
export const UseAxios = <T>(url: string, methodType:any, dependencyList: Array<Object>, params?: any): IAxiosResult<T> => {
  const isCurrent = useRef(true);
  const [state, setState] = useState<IAxiosResult<T>>({ Data: null, IsLoading: true, Errors: "" });

  useEffect(() => {
    return () => {
      isCurrent.current = false
    }
  }, []);

  useEffect(() => {
    if (!url) {
      setState({ ...state, IsLoading: false });
      return;
    }
    setState({ ...state, IsLoading: true });

    if (dependencyList.length > 0 && !dependencyList[0])
      return;

    setTimeout(() => {
      axios(config(url,methodType,params))
        .then((response) => {
          setState({ ...state, Data: response.data, IsLoading: false });
        })
        .catch((error) => {
          setState({ ...state, IsLoading: false, Errors: error });
          console.log(error.message);
        })
    }, Math.random() * MAXIMUM_DELAY);
  }, dependencyList);

  return state;
}