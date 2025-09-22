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

import type { CustomerId, JsonNode, TenantId } from '../types/common';

export interface Customer {
  id?: CustomerId;
  createdTime?: number;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  address2?: string;
  zip?: string;
  phone?: string;
  email: string;
  title: string;
  tenantId?: TenantId;
  version?: number;
  name?: string;
  additionalInfo?: JsonNode;
}

export interface PageDataCustomer {
  data: Customer[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}
