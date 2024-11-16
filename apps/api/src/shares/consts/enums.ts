export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum QuoteStatus {
  WAITING = 'WAITING',
  RESPONDED = 'RESPONDED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STORE_OWNER = 'STORE_OWNER',
  APP_USER = 'APP_USER',
}
