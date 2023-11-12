import { Response } from 'express';

export interface ISetCookieInterface {
  response: Response;
  refreshToken: string;
}
