export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  stores: string[];
  [key: string]: unknown;
}
