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

import { describe, expect, it } from 'vitest';
import { Configuration } from '../rest/configuration';
import { RestClientObject } from '../rest/rest-client';

describe('Configuration', () => {
  it('should create a configuration with default values', () => {
    const config = new Configuration();
    expect(config.host).toBe('http://127.0.0.1:8080');
    expect(config.verifySsl).toBe(true);
    expect(config.debug).toBe(false);
  });

  it('should allow setting custom values', () => {
    const config = new Configuration();
    config.host = 'https://demo.thingsboard.io';
    config.verifySsl = false;
    expect(config.host).toBe('https://demo.thingsboard.io');
    expect(config.verifySsl).toBe(false);
  });
});

describe('RestClientObject', () => {
  it('should create a REST client object with configuration', () => {
    const config = new Configuration();
    const client = new RestClientObject(config);
    expect(client).toBeInstanceOf(RestClientObject);
  });

  it('should have HTTP method functions', () => {
    const config = new Configuration();
    const client = new RestClientObject(config);
    expect(typeof client.GET).toBe('function');
    expect(typeof client.POST).toBe('function');
    expect(typeof client.PUT).toBe('function');
    expect(typeof client.DELETE).toBe('function');
    expect(typeof client.PATCH).toBe('function');
    expect(typeof client.HEAD).toBe('function');
    expect(typeof client.OPTIONS).toBe('function');
  });
});
