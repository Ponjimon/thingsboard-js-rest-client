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

import { beforeEach, describe, expect, it } from 'vitest';
import { RestClientCE } from '../rest-client-ce';

describe('RestClientCE', () => {
  let client: RestClientCE;

  beforeEach(() => {
    client = new RestClientCE('http://localhost:8080');
  });

  it('should create an instance', () => {
    expect(client).toBeInstanceOf(RestClientCE);
  });

  it('should have the correct base URL', () => {
    expect(client.baseUrl).toBe('http://localhost:8080');
  });

  it('should have token login method', () => {
    expect(typeof client.tokenLogin).toBe('function');
  });

  it('should have device management methods', () => {
    expect(typeof client.getDevice).toBe('function');
    expect(typeof client.saveDevice).toBe('function');
    expect(typeof client.deleteDevice).toBe('function');
    expect(typeof client.getTenantDevices).toBe('function');
  });

  it('should have customer management methods', () => {
    expect(typeof client.getCustomer).toBe('function');
    expect(typeof client.saveCustomer).toBe('function');
    expect(typeof client.deleteCustomer).toBe('function');
    expect(typeof client.getCustomers).toBe('function');
  });

  it('should have user management methods', () => {
    expect(typeof client.getUser).toBe('function');
    expect(typeof client.saveUser).toBe('function');
    expect(typeof client.deleteUser).toBe('function');
    expect(typeof client.getUsers).toBe('function');
  });
});
