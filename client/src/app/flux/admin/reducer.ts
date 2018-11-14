import { ActionReducer, Action } from "@ngrx/store";

export const LOGGING_IN = "LOGGING_IN";
export const LOGGED_IN = "LOGGED_IN";
export const LOGGED_OUT = "LOGGED_OUT";

const initialState = {
  loading: false,
  authorized: false
};

export function adminReducer(state: object = initialState, action: Action) {
  switch (action.type) {
    case LOGGING_IN:
      return { ...state, loading: true };
    case LOGGED_IN:
      return { ...state, loading: false, authorized: true };
    case LOGGED_OUT:
      return { ...state, loading: false, authorized: false };
    default:
      return state;
  }
}
