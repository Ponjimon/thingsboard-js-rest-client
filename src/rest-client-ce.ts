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

import { DeviceControllerApi } from './api/device-controller';
import type { Customer, PageDataCustomer } from './models/customer';
import type { Device, DeviceInfo, PageDataDevice } from './models/device';
import type { ActivateUserRequest, PageDataUser, User, UserActivationLink } from './models/user';
import { RestClientBase } from './rest/rest-client-base';
import type { CustomerId, DeviceId, JwtPair, UserId } from './types/common';

export class RestClientCE extends RestClientBase {
  private deviceController?: DeviceControllerApi;

  // Initialize controllers after login
  private initializeControllers(): void {
    const apiClient = this.getApiClient();
    this.deviceController = new DeviceControllerApi(apiClient);
  }

  async login(username: string, password: string): Promise<void> {
    await super.login(username, password);
    this.initializeControllers();
  }

  async publicLogin(publicId: string): Promise<void> {
    await super.publicLogin(publicId);
    this.initializeControllers();
  }

  tokenLogin(token: string, refreshToken?: string): void {
    super.tokenLogin(token, refreshToken);
    this.initializeControllers();
  }

  // Device Controller methods
  async assignDeviceToCustomer(customerId: CustomerId | string, deviceId: DeviceId | string): Promise<Device> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.assignDeviceToCustomer(this.getId(customerId), this.getId(deviceId));
  }

  async unassignDeviceFromCustomer(deviceId: DeviceId | string): Promise<Device> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.unassignDeviceFromCustomer(this.getId(deviceId));
  }

  async deleteDevice(deviceId: DeviceId | string): Promise<void> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.deleteDevice(this.getId(deviceId));
  }

  async getDevice(deviceId: DeviceId | string): Promise<Device> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.getDevice(this.getId(deviceId));
  }

  async getDeviceInfo(deviceId: DeviceId | string): Promise<DeviceInfo> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.getDeviceInfo(this.getId(deviceId));
  }

  async getTenantDevices(
    pageSize: number,
    page: number,
    type?: string,
    textSearch?: string,
    sortProperty?: string,
    sortOrder?: string,
  ): Promise<PageDataDevice> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.getTenantDevices(pageSize, page, type, textSearch, sortProperty, sortOrder);
  }

  async getCustomerDevices(
    customerId: CustomerId | string,
    pageSize: number,
    page: number,
    type?: string,
    textSearch?: string,
    sortProperty?: string,
    sortOrder?: string,
  ): Promise<PageDataDevice> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.getCustomerDevices(
      this.getId(customerId),
      pageSize,
      page,
      type,
      textSearch,
      sortProperty,
      sortOrder,
    );
  }

  async saveDevice(device: Device): Promise<Device> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.saveDevice(device);
  }

  async getDevicesByIds(deviceIds: (DeviceId | string)[]): Promise<Device[]> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    const ids = deviceIds.map(id => this.getId(id));
    return this.deviceController.getDevicesByIds(ids);
  }

  async findDeviceByName(deviceName: string): Promise<Device> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.findByName(deviceName);
  }

  async claimDevice(deviceName: string, secretKey: string): Promise<string> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.claimDevice(deviceName, secretKey);
  }

  async getDeviceTypes(): Promise<string[]> {
    if (!this.deviceController) throw new Error('Device controller not initialized. Please login first.');
    return this.deviceController.getDeviceTypes();
  }

  // Customer Controller methods (to be implemented)
  async getCustomers(
    pageSize: number,
    page: number,
    textSearch?: string,
    sortProperty?: string,
    sortOrder?: string,
  ): Promise<PageDataCustomer> {
    const params: Record<string, string | number> = {
      pageSize,
      page,
    };

    if (textSearch) params.textSearch = textSearch;
    if (sortProperty) params.sortProperty = sortProperty;
    if (sortOrder) params.sortOrder = sortOrder;

    const response = await this.getApiClient().GET<PageDataCustomer>('/api/customers', {
      queryParams: params,
    });
    return response.data;
  }

  async getCustomer(customerId: CustomerId | string): Promise<Customer> {
    const response = await this.getApiClient().GET<Customer>(`/api/customer/${this.getId(customerId)}`);
    return response.data;
  }

  async saveCustomer(customer: Customer): Promise<Customer> {
    const response = await this.getApiClient().POST<Customer>('/api/customer', { body: customer });
    return response.data;
  }

  async deleteCustomer(customerId: CustomerId | string): Promise<void> {
    await this.getApiClient().DELETE(`/api/customer/${this.getId(customerId)}`);
  }

  // User Controller methods (to be implemented)
  async getUsers(
    pageSize: number,
    page: number,
    textSearch?: string,
    sortProperty?: string,
    sortOrder?: string,
  ): Promise<PageDataUser> {
    const params: Record<string, string | number> = {
      pageSize,
      page,
    };

    if (textSearch) params.textSearch = textSearch;
    if (sortProperty) params.sortProperty = sortProperty;
    if (sortOrder) params.sortOrder = sortOrder;

    const response = await this.getApiClient().GET<PageDataUser>('/api/users', {
      queryParams: params,
    });
    return response.data;
  }

  async getUser(userId: UserId | string): Promise<User> {
    const response = await this.getApiClient().GET<User>(`/api/user/${this.getId(userId)}`);
    return response.data;
  }

  async saveUser(user: User, sendActivationMail = true): Promise<User> {
    const response = await this.getApiClient().POST<User>('/api/user', {
      body: user,
      queryParams: { sendActivationMail },
    });
    return response.data;
  }

  async deleteUser(userId: UserId | string): Promise<void> {
    await this.getApiClient().DELETE(`/api/user/${this.getId(userId)}`);
  }

  async getUserToken(userId: UserId | string): Promise<JwtPair> {
    const response = await this.getApiClient().GET<JwtPair>(`/api/user/${this.getId(userId)}/token`);
    return response.data;
  }

  async getActivationLink(userId: UserId | string): Promise<string> {
    const response = await this.getApiClient().GET<UserActivationLink>(
      `/api/user/${this.getId(userId)}/activationLink`,
    );
    return response.data.activationLink;
  }

  async activateUser(activateRequest: ActivateUserRequest): Promise<JwtPair> {
    const response = await this.getApiClient().POST<JwtPair>('/api/noauth/activate', { body: activateRequest });
    return response.data;
  }
}
