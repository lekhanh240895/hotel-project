import querystring from 'query-string';
import { myFetch } from '../utils';

const appendParamsToUrl = (url: string, params?: Record<string, any>) => {
  if (!params || !Object.keys(params).length) return url;
  return `${url}?${querystring.stringify(params)}`;
};

const processBodyType = (
  body: Record<string, any>,
  bodyType: BodyType.Json | BodyType.Urlencoded
) => {
  let headers: HeadersInit = {};
  let bodyToSend: string | FormData = '';

  if (bodyType === BodyType.Json) {
    headers = {
      'Content-Type': 'application/json'
    };
    bodyToSend = body ? JSON.stringify(body) : '';
  } else if (bodyType === BodyType.Urlencoded) {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    bodyToSend = body ? new URLSearchParams(body).toString() : '';
  }

  return { headers, bodyToSend };
};

export enum BodyType {
  Json,
  Urlencoded
}

interface IRequestOptions {
  bodyType?: BodyType;
  body?: any;
  headers?: HeadersInit;
  params?: Record<string, any>;
  cache?: RequestCache;
}

const get = (
  url: string,
  options?: {
    headers?: HeadersInit;
    params?: Record<string, any>;
    cache?: RequestCache;
  }
) => {
  const urlParams = appendParamsToUrl(url, options?.params);

  return myFetch(urlParams, {
    headers: {
      ...(options?.headers || {})
    },
    ...options
  });
};

const post = (url: string, options: IRequestOptions) => {
  const urlParams = appendParamsToUrl(url, options?.params);
  const { headers, bodyToSend } = processBodyType(
    options.body,
    options?.bodyType || BodyType.Json
  );

  return myFetch(urlParams, {
    method: 'POST',
    headers: {
      ...headers,
      ...(options?.headers || {})
    },
    body: bodyToSend,
    cache: options?.cache || 'no-store'
  });
};

const put = (url: string, options: IRequestOptions) => {
  const urlParams = appendParamsToUrl(url, options?.params);
  const { headers, bodyToSend } = processBodyType(
    options.body,
    options?.bodyType || BodyType.Json
  );

  return myFetch(urlParams, {
    method: 'PUT',
    headers: {
      ...headers,
      ...(options?.headers || {})
    },
    body: bodyToSend
  });
};

export { get, post, put };
