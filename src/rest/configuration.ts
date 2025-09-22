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

export interface ApiKeyMap {
  [key: string]: string;
}

export interface ApiKeyPrefixMap {
  [key: string]: string;
}

export class Configuration {
  host = 'http://127.0.0.1:8080';
  tempFolderPath?: string;
  apiKey: ApiKeyMap = {};
  apiKeyPrefix: ApiKeyPrefixMap = {};
  refreshApiKeyHook?: () => void;
  username?: string;
  password?: string;
  accessToken?: string | (() => string);
  ssl?: boolean;
  verifySsl = true;
  sslCaFile?: string;
  sslCertFile?: string;
  sslKeyFile?: string;
  sslContext?: unknown;
  proxyHost?: string;
  proxyPort?: number;
  safeCharsForPathParam = '';
  connectionPool?: number;
  maxConnectionPoolSize?: number;
  retries?: number;
  connectTimeout?: number;
  readTimeout?: number;
  debug = false;
  loggerFile?: string;
  loggerFormat?: string;
  loggerStreamHandler?: unknown;
  loggerFileHandler?: unknown;

  private static _default?: Configuration;

  constructor() {
    if (Configuration._default) {
      // Copy properties from default configuration
      Object.assign(this, Configuration._default);
    }
  }

  static getDefaultCopy(): Configuration {
    return new Configuration();
  }

  static setDefaultConfiguration(configuration: Configuration): void {
    Configuration._default = configuration;
  }
}
