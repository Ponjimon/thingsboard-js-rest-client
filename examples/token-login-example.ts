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

import { RestClientCE } from '../src';

async function tokenLoginExample(): Promise<void> {
  // ThingsBoard REST API URL
  const url = 'http://localhost:8080';

  // JWT token from previous login (you would get this from a login response)
  const jwtToken = 'your-jwt-token-here';
  const refreshToken = 'your-refresh-token-here';

  try {
    // Create REST client instance
    const client = new RestClientCE(url);

    // Perform token login
    console.log('Logging in with token...');
    client.tokenLogin(jwtToken, refreshToken);
    console.log('Token login successful!');

    // Now you can use the client to make API calls
    console.log('Fetching device types...');
    const deviceTypes = await client.getDeviceTypes();
    console.log(`Available device types: ${deviceTypes.join(', ')}`);

    // Get tenant devices
    console.log('Fetching tenant devices...');
    const devices = await client.getTenantDevices(5, 0);
    console.log(`Found ${devices.totalElements} devices in tenant`);

    // Display some device information
    for (const device of devices.data) {
      console.log(`Device: ${device.name} (${device.type}) - ID: ${device.id?.id}`);
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Example showing how to get JWT token first
async function getTokenExample(): Promise<void> {
  const url = 'http://localhost:8080';
  const username = 'tenant@thingsboard.org';
  const password = 'tenant';

  try {
    const client = new RestClientCE(url);

    // Login to get tokens
    await client.login(username, password);
    console.log('Login successful!');

    // Access the token information
    console.log('Token info:', client.tokenInfo);

    // Use the tokens for subsequent sessions
    const { token, refreshToken } = client.tokenInfo;

    // Create a new client instance and use token login
    const newClient = new RestClientCE(url);
    newClient.tokenLogin(token, refreshToken);

    // Test the new client
    const devices = await newClient.getTenantDevices(1, 0);
    console.log(`Token login worked! Found ${devices.totalElements} devices`);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

if (require.main === module) {
  console.log('=== Token Login Example ===');
  getTokenExample().catch(console.error);
}

export { tokenLoginExample, getTokenExample };
