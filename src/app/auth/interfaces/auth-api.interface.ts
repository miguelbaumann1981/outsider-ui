import { AuthUser } from './auth-user.interface';

export interface AuthApi {
  user: AuthUser;
  token: string;
}
