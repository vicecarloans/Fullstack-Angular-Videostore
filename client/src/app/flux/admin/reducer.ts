import { ActionReducer, Action } from "@ngrx/store";
import { AuthActionTypes, AuthActionsUnion } from "./actions";

const initialState = {
  loading: false,
  authorized: false,
  err: 0
};

export function adminReducer(
  state: object = initialState,
  action: AuthActionsUnion
) {
  switch (action.type) {
    case AuthActionTypes.LOGGING_IN:
      return { ...state, loading: true };
    case AuthActionTypes.LOGGED_IN:
      return { ...state, loading: false, authorized: true };
    case AuthActionTypes.LOGGED_IN_FAILED:
      return { ...state, err: action.error };
    case AuthActionTypes.LOGGED_OUT:
      return { ...state, loading: false, authorized: false };
    case AuthActionTypes.RESET:
      return { ...state, err: 0 };
    default:
      return state;
  }
}
