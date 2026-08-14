import type { AppEnvironment } from '../app/core/models/environment.model';

export const environment: AppEnvironment = {
  production: false,
  /** Laravel REST API root. Every HTTP call is built from this — never hardcode a URL. */
  apiBaseUrl: 'http://localhost:8000/api',
  /**
   * While the Laravel backend is not running, the catalogue is served from the
   * in-repo mock dataset through the same service contract.
   */
  useMockData: true,
  currency: 'BDT',
  locale: 'en-US',
  freeShippingThreshold: 15000,
  flatShippingRate: 1200,
};
