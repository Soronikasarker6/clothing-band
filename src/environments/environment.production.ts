import type { AppEnvironment } from '../app/core/models/environment.model';

export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: '/api',
  useMockData: true,
  currency: 'BDT',
  locale: 'en-US',
  freeShippingThreshold: 15000,
  flatShippingRate: 1200,
};
