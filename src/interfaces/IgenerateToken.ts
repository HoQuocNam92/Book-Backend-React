import { SignOptions } from 'jsonwebtoken';

export interface IgenerateToken {
  id: number;
  role_id: number[];
  exp: SignOptions['expiresIn'];
  secret: string;
}
