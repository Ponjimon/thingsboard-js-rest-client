# ThingsBoard JavaScript/TypeScript REST API client

The ThingsBoard REST API Client helps you interact with [ThingsBoard REST API](https://thingsboard.io/docs/reference/rest-api/) from your JavaScript or TypeScript application.  
With [JavaScript Rest Client](https://thingsboard.io/docs/reference/js-rest-client/) you can programmatically create assets, devices, customers, users and other entities and their relations in ThingsBoard.

The recommended method for installing the Rest Client is npm or pnpm.  

*The JavaScript/TypeScript version of the REST API client is under developing. If you have discovered any bug, please write us using email or by opening the issue.*

## Installation 

In order to install the ThingsBoard REST client, you should use the following command:

```bash
npm install thingsboard-js-rest-client
``` 

Or with pnpm:

```bash
pnpm add thingsboard-js-rest-client
```

## Examples 

You can find the examples of the usage in the "examples" folder or on the [our website](https://thingsboard.io/docs/reference/js-rest-client/).

**Note:** There are 2 REST clients for ThingsBoard, they are depend on version of the ThingsBoard, you use.  

- If you use the ThingsBoard Community Edition (ThingsBoard CE) - please use the following command to import the REST client into your script:  
  ```typescript
  import { RestClientCE } from 'thingsboard-js-rest-client';
  ```
  The REST client class has name "RestClientCE".  
   
- If you use the ThingsBoard Professional Edition (ThingsBoard PE) - please use the following command to import the REST client into your script:  
  ```typescript
  import { RestClientPE } from 'thingsboard-js-rest-client';
  ```
  The REST client class has name "RestClientPE".  

If you use the wrong version of the REST client, it could work unexpectedly.

## Usage

### Basic Usage

```typescript
import { RestClientCE, type Device, type Customer } from 'thingsboard-js-rest-client';

async function example() {
  const client = new RestClientCE('http://localhost:8080');
  
  // Login
  await client.login('tenant@thingsboard.org', 'tenant');
  
  // Get devices
  const devices = await client.getTenantDevices(10, 0);
  console.log(`Found ${devices.totalElements} devices`);
  
  // Create a device
  const newDevice: Device = {
    name: 'My Device',
    type: 'sensor',
    deviceProfileId: { id: 'your-device-profile-id', entityType: 'DEVICE_PROFILE' }
  };
  
  const savedDevice = await client.saveDevice(newDevice);
  console.log(`Created device with ID: ${savedDevice.id?.id}`);
}
```

### Token-based Authentication

```typescript
import { RestClientCE } from 'thingsboard-js-rest-client';

const client = new RestClientCE('http://localhost:8080');

// Use JWT token from previous login
client.tokenLogin('your-jwt-token', 'your-refresh-token');

// Now you can make API calls
const devices = await client.getTenantDevices(10, 0);
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions. You get:

- **Type safety** - Catch errors at compile time
- **IntelliSense** - Auto-completion in your IDE  
- **Better documentation** - Types serve as documentation
- **Refactoring support** - Safe renaming and refactoring

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format
```

## Support

 - [Community chat](https://gitter.im/thingsboard/chat)
 - [Q&A forum](https://groups.google.com/forum/#!forum/thingsboard)
 - [Stackoverflow](http://stackoverflow.com/questions/tagged/thingsboard)
 
**Don't forget to star the repository to show your ❤️ and support.**


## Licenses

This project is released under [Apache 2.0 License](./LICENSE).
