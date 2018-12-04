export class AdminReducerModel {
  public loading: boolean;
  public authorized: boolean;
  public err: number;
}
export class TokenModel {
  public admin: AdminReducerModel;
  public iat: number;
  public exp: number;
  public sub: string;
}
