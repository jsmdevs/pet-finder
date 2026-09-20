import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      _user?: {
        id: string; // O number, según el tipo de tu id
      };
    }
  }
}