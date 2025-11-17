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

import { type Customer, type Device, RestClientCE } from '../src';

async function main(): Promise<void> {
  // ThingsBoard REST API URL
  const url = 'http://localhost:8080';

  // Default Tenant Administrator credentials
  const username = 'tenant@thingsboard.org';
  const password = 'tenant';

  try {
    // Create REST client instance
    const client = new RestClientCE(url);

    // Perform login and get token
    console.log('Logging in...');
    await client.login(username, password);
    console.log('Login successful!');

    // Get tenant devices with page size limit
    console.log('Fetching tenant devices...');
    const devices = await client.getTenantDevices(10, 0);
    console.log(`Found ${devices.totalElements} devices`);

    // Create a new customer
    console.log('Creating a new customer...');
    const newCustomer: Customer = {
      title: 'Test Customer',
      email: 'test@example.com',
    };

    const savedCustomer = await client.saveCustomer(newCustomer);
    console.log(`Created customer: ${savedCustomer.title} with ID: ${savedCustomer.id?.id}`);

    // Create a new device
    console.log('Creating a new device...');
    const newDevice: Device = {
      name: 'Test Device',
      type: 'default',
      deviceProfileId: {
        id: 'default-device-profile-id', // You would get this from your ThingsBoard instance
        entityType: 'DEVICE_PROFILE',
      },
    };

    const savedDevice = await client.saveDevice(newDevice);
    console.log(`Created device: ${savedDevice.name} with ID: ${savedDevice.id?.id}`);

    // Assign device to customer
    if (savedCustomer.id && savedDevice.id) {
      console.log('Assigning device to customer...');
      await client.assignDeviceToCustomer(savedCustomer.id, savedDevice.id);
      console.log('Device assigned successfully!');
    }

    // Get device types
    console.log('Fetching device types...');
    const deviceTypes = await client.getDeviceTypes();
    console.log(`Available device types: ${deviceTypes.join(', ')}`);

    // Get customers
    console.log('Fetching customers...');
    const customers = await client.getCustomers(10, 0);
    console.log(`Found ${customers.totalElements} customers`);

    // Clean up - delete the created entities
    if (savedDevice.id) {
      console.log('Cleaning up - deleting device...');
      await client.deleteDevice(savedDevice.id);
      console.log('Device deleted successfully!');
    }

    if (savedCustomer.id) {
      console.log('Cleaning up - deleting customer...');
      await client.deleteCustomer(savedCustomer.id);
      console.log('Customer deleted successfully!');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { main };
