import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export function verifyJwt(req: Request): any | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    return decoded;
  } catch {
    return null;
  }
}
