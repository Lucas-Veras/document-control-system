export interface IRefreshToken {
  refresh: string | null;
}

export interface IAuthTokens {
  access: string;
  refresh: string;
}
