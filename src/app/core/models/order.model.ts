import type { SizeCode } from './catalog.model';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  readonly productId: number;
  readonly name: string;
  readonly image: string;
  readonly quantity: number;
  readonly price: number;
  readonly size: SizeCode;
  readonly colorName: string;
}

export interface Order {
  readonly id: number;
  readonly reference: string;
  readonly placedAt: string;
  readonly status: OrderStatus;
  readonly items: readonly OrderItem[];
  readonly subtotal: number;
  readonly shipping: number;
  readonly discount: number;
  readonly total: number;
}

export interface Address {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly addressLine: string;
  readonly city: string;
  readonly country: string;
  readonly postalCode: string;
}
