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

import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import type { EntityId, LoginRequest, LoginResponse, PublicLoginRequest, TokenInfo } from '../types/common';
import { Configuration } from './configuration';
import { RestClientObject } from './rest-client';

export class RestClientBase {
  public baseUrl: string;
  public tokenInfo: TokenInfo = { token: '', refreshToken: '', exp: 0 };
  protected apiClient?: RestClientObject;
  protected loggedIn = false;
  protected stopped = true;
  protected configuration: Configuration;
  private refreshTimer?: NodeJS.Timeout | undefined;

  protected username?: string;
  protected password?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`;
    this.configuration = new Configuration();
    this.configuration.host = this.baseUrl;
  }

  protected start(): void {
    this.stopped = false;
    this.startTokenRefreshTimer();
  }

  protected stop(): void {
    this.stopped = true;
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  private startTokenRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(async () => {
      try {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= this.tokenInfo.exp && this.loggedIn) {
          if (this.tokenInfo.refreshToken) {
            await this.refresh();
          } else {
            console.error('No refresh token available!');
          }
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, 1000);
  }

  async login(username: string, password: string): Promise<void> {
    const loginRequest: LoginRequest = { username, password };

    try {
      const response = await axios.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, loginRequest, {
        httpsAgent: this.configuration.verifySsl ? undefined : { rejectUnauthorized: false },
      });

      this.saveToken(response.data);
      this.username = username;
      this.password = password;
      this.loggedIn = true;
      this.loadConfiguration();
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  async publicLogin(publicId: string): Promise<void> {
    const loginRequest: PublicLoginRequest = { publicId };

    try {
      const response = await axios.post<LoginResponse>(`${this.baseUrl}/api/auth/login/public`, loginRequest, {
        httpsAgent: this.configuration.verifySsl ? undefined : { rejectUnauthorized: false },
      });

      this.saveToken(response.data);
      this.loadConfiguration();
    } catch (error) {
      throw new Error(`Public login failed: ${error}`);
    }
  }

  tokenLogin(token: string, refreshToken?: string): void {
    const tokenData: LoginResponse = {
      token,
      refreshToken: refreshToken || '',
    };

    this.saveToken(tokenData);
    this.loadConfiguration();
  }

  async refresh(): Promise<void> {
    if (!this.tokenInfo.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<LoginResponse>(
        `${this.baseUrl}/api/auth/token`,
        { refreshToken: this.tokenInfo.refreshToken },
        { httpsAgent: this.configuration.verifySsl ? undefined : { rejectUnauthorized: false } },
      );

      this.saveToken(response.data);
    } catch (error) {
      throw new Error(`Token refresh failed: ${error}`);
    }
  }

  logout(): void {
    this.tokenInfo = { token: '', refreshToken: '', exp: 0 };
    this.loggedIn = false;
    this.configuration.accessToken = '';
    this.stop();
  }

  private saveToken(tokenData: LoginResponse): void {
    this.tokenInfo.token = tokenData.token;
    this.tokenInfo.refreshToken = tokenData.refreshToken;

    try {
      const decoded = jwt.decode(tokenData.token) as jwt.JwtPayload;
      this.tokenInfo.exp = decoded.exp || 0;
    } catch (error) {
      console.warn('Failed to decode JWT token:', error);
      this.tokenInfo.exp = 0;
    }
  }

  private loadConfiguration(): void {
    this.configuration.accessToken = this.tokenInfo.token;
    this.apiClient = new RestClientObject(this.configuration);
  }

  protected getId(entityId: EntityId | string): string {
    if (typeof entityId === 'string') {
      return entityId;
    }
    return entityId.id;
  }

  protected getApiClient(): RestClientObject {
    if (!this.apiClient) {
      throw new Error('API client not initialized. Please login first.');
    }
    return this.apiClient;
  }
}
