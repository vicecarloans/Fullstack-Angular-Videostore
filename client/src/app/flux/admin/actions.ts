import { Action } from "@ngrx/store";

export enum AuthActionTypes {
  LOGGING_IN = "LOGGING_IN",
  LOGGED_IN = "LOGGED_IN",
  LOGGED_OUT = "LOGGED_OUT",
  LOGGED_IN_FAILED = "LOGGED_IN_FAILED",
  RESET = "RESET"
}

export class AuthLogging implements Action {
  readonly type = AuthActionTypes.LOGGING_IN;
}

export class AuthLoggedIn implements Action {
  readonly type = AuthActionTypes.LOGGED_IN;
}

export class AuthLoggedOut implements Action {
  readonly type = AuthActionTypes.LOGGED_OUT;
}

export class AuthFailed implements Action {
  readonly type = AuthActionTypes.LOGGED_IN_FAILED;
  constructor(public error: number) {}
}

export class AuthReset implements Action {
  readonly type = AuthActionTypes.RESET;
}

export type AuthActionsUnion =
  | AuthLogging
  | AuthLoggedIn
  | AuthLoggedOut
  | AuthFailed
  | AuthReset;
