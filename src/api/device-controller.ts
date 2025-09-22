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

import type { Device, DeviceInfo, PageDataDevice } from '../models/device';
import type { RestClientObject } from '../rest/rest-client';

export class DeviceControllerApi {
  constructor(private apiClient: RestClientObject) {}

  async assignDeviceToCustomer(customerId: string, deviceId: string): Promise<Device> {
    const response = await this.apiClient.POST<Device>(`/api/customer/${customerId}/device/${deviceId}`);
    return response.data;
  }

  async unassignDeviceFromCustomer(deviceId: string): Promise<Device> {
    const response = await this.apiClient.DELETE<Device>(`/api/customer/device/${deviceId}`);
    return response.data;
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await this.apiClient.DELETE(`/api/device/${deviceId}`);
  }

  async getDevice(deviceId: string): Promise<Device> {
    const response = await this.apiClient.GET<Device>(`/api/device/${deviceId}`);
    return response.data;
  }

  async getDeviceInfo(deviceId: string): Promise<DeviceInfo> {
    const response = await this.apiClient.GET<DeviceInfo>(`/api/device/info/${deviceId}`);
    return response.data;
  }

  async getTenantDevices(
    pageSize: number,
    page: number,
    type?: string,
    textSearch?: string,
    sortProperty?: string,
    sortOrder?: string,
  ): Promise<PageDataDevice> {
    const params: Record<string, string | number> = {
      pageSize,
      page,
    };

    if (type) params.type = type;
    if (textSearch) params.textSearch = textSearch;
    if (sortProperty) params.sortProperty = sortProperty;
    if (sortOrder) params.sortOrder = sortOrder;

    const response = await this.apiClient.GET<PageDataDevice>('/api/tenant/devices', {
      queryParams: params,
    });
    return response.data;
  }

  async getCustomerDevices(
    customerId: string,
    pageSize: number,
    page: number,
    type?: string,
    textSearch?: string,
    sortProperty?: string,
    sortOrder?: string,
  ): Promise<PageDataDevice> {
    const params: Record<string, string | number> = {
      pageSize,
      page,
    };

    if (type) params.type = type;
    if (textSearch) params.textSearch = textSearch;
    if (sortProperty) params.sortProperty = sortProperty;
    if (sortOrder) params.sortOrder = sortOrder;

    const response = await this.apiClient.GET<PageDataDevice>(`/api/customer/${customerId}/devices`, {
      queryParams: params,
    });
    return response.data;
  }

  async saveDevice(device: Device): Promise<Device> {
    const response = await this.apiClient.POST<Device>('/api/device', { body: device });
    return response.data;
  }

  async getDevicesByIds(deviceIds: string[]): Promise<Device[]> {
    const response = await this.apiClient.GET<Device[]>('/api/devices', {
      queryParams: { deviceIds: deviceIds.join(',') },
    });
    return response.data;
  }

  async findByName(deviceName: string): Promise<Device> {
    const response = await this.apiClient.GET<Device>('/api/tenant/devices', {
      queryParams: { deviceName },
    });
    return response.data;
  }

  async claimDevice(deviceName: string, secretKey: string): Promise<string> {
    const response = await this.apiClient.POST<{ message: string }>('/api/customer/device/claim', {
      body: { deviceName, secretKey },
    });
    return response.data.message;
  }

  async getDeviceTypes(): Promise<string[]> {
    const response = await this.apiClient.GET<string[]>('/api/device/types');
    return response.data;
  }
}
