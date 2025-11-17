/**
 * Copyright 2025. ThingsBoard
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { Configuration } from './configuration';

export interface RequestOptions {
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  timeout?: number;
}

export interface RestResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class ApiException extends Error {
  status: number;
  response?: AxiosResponse | undefined;

  constructor(status: number, message?: string, response?: AxiosResponse | undefined) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.response = response;
  }
}

export class RestClientObject {
  private axiosInstance: AxiosInstance;

  constructor(configuration: Configuration) {
    this.axiosInstance = axios.create({
      baseURL: configuration.host,
      timeout: configuration.connectTimeout || 30000,
      httpsAgent: configuration.verifySsl
        ? undefined
        : {
            rejectUnauthorized: false,
          },
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(config => {
      if (configuration.accessToken) {
        const token =
          typeof configuration.accessToken === 'function' ? configuration.accessToken() : configuration.accessToken;
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        throw new ApiException(error.response?.status || 0, error.message, error.response);
      },
    );
  }

  async request<T = unknown>(
    method: string,
    url: string,
    options: RequestOptions & { body?: unknown; postParams?: Record<string, unknown> } = {},
  ): Promise<RestResponse<T>> {
    const config: AxiosRequestConfig = {
      method: method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options',
      url,
    };

    if (options.headers) {
      config.headers = options.headers;
    }

    if (options.queryParams) {
      config.params = options.queryParams;
    }

    if (options.timeout) {
      config.timeout = options.timeout;
    }

    if (options.body !== undefined) {
      config.data = options.body;
    } else if (options.postParams) {
      config.data = options.postParams;
    }

    const response = await this.axiosInstance.request<T>(config);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  }

  async GET<T = unknown>(url: string, options: RequestOptions = {}): Promise<RestResponse<T>> {
    return this.request<T>('GET', url, options);
  }

  async POST<T = unknown>(
    url: string,
    options: RequestOptions & { body?: unknown; postParams?: Record<string, unknown> } = {},
  ): Promise<RestResponse<T>> {
    return this.request<T>('POST', url, options);
  }

  async PUT<T = unknown>(
    url: string,
    options: RequestOptions & { body?: unknown; postParams?: Record<string, unknown> } = {},
  ): Promise<RestResponse<T>> {
    return this.request<T>('PUT', url, options);
  }

  async PATCH<T = unknown>(
    url: string,
    options: RequestOptions & { body?: unknown; postParams?: Record<string, unknown> } = {},
  ): Promise<RestResponse<T>> {
    return this.request<T>('PATCH', url, options);
  }

  async DELETE<T = unknown>(url: string, options: RequestOptions & { body?: unknown } = {}): Promise<RestResponse<T>> {
    return this.request<T>('DELETE', url, options);
  }

  async HEAD<T = unknown>(url: string, options: RequestOptions = {}): Promise<RestResponse<T>> {
    return this.request<T>('HEAD', url, options);
  }

  async OPTIONS<T = unknown>(
    url: string,
    options: RequestOptions & { body?: unknown; postParams?: Record<string, unknown> } = {},
  ): Promise<RestResponse<T>> {
    return this.request<T>('OPTIONS', url, options);
  }
}
