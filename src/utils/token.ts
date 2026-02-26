import jwt from 'jsonwebtoken';
import { IgenerateToken } from '../interfaces/IgenerateToken.js';

export const generateToken = (data: IgenerateToken) => {
  return jwt.sign({ id: data.id, role_id: data.role_id }, data.secret, {
    expiresIn: data.exp,
  });
};
