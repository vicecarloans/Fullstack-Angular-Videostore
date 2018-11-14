export class AdminReducerModel {
  public loading: boolean;
  public authorized: boolean;
}
export class TokenModel {
  public admin: AdminReducerModel;
  public iat: number;
  public exp: number;
  public sub: string;
}
