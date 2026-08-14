export type UserRole = 'customer' | 'admin';

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
}

export interface AuthSession {
  readonly user: User;
  readonly token: string;
}
