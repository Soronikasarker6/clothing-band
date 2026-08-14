export interface AppEnvironment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly useMockData: boolean;
  readonly currency: string;
  readonly locale: string;
  readonly freeShippingThreshold: number;
  readonly flatShippingRate: number;
}
