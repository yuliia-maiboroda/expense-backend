import { IPayload, IRefreshPayload } from '../interfaces/jwt-interface';

export const mockedAccessPayload: IPayload = {
  userId: 1,
  sessionId: 'mockedSessionId',
};

export const mockedRefreshPayload: IRefreshPayload = {
  userId: 1,
  refreshId: 'mockedRefreshId',
};

export const mockedAccessToken = 'mockedAccessToken';

export const mockedRefreshToken = 'mockedRefreshToken';
