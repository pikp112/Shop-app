import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        authError: null,
        user: user,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    default:
      return state;
  }
}

// Alternative syntax:
// import { createReducer, on } from '@ngrx/store';

// import { User } from '../user.model';
// import * as AuthActions from './auth.actions';

// export interface State {
//   user: User;
//   authError: string;
//   loading: boolean;
// }

// const initialState: State = {
//   user: null,
//   authError: null,
//   loading: false
// };

// export const authReducer = createReducer(
//   initialState,
//   on(
//     AuthActions.authenticateSuccess,
//     (state, action) => {
//       const user = new User(
//         action.email,
//         action.userId,
//         action.token,
//         action.expirationDate
//       );
//       return {
//         ...state,
//         authError: null,
//         user: user,
//         loading: false
//       };
//     }
//   ),
//   on(
//     AuthActions.logout,
//     (state) => {
//       return {
//         ...state,
//        user: null
//       };
//     }
//   ),
//   on(
//     AuthActions.loginStart,
//     (state) => {
//       return {
//         ...state,
//         authError: null,
//         loading: true
//       };
//     }
//   ),
//   on(
//     AuthActions.authenticateFail,
//     (state, action) => {
//       return {
//         ...state,
//         user: null,
//         authError: action.error,
//         loading: false
//       };
//     }
//   ),
//   on(
//     AuthActions.clearError,
//     (state) => {
//       return {
//         ...state,
//         authError: null
//       };
//     }
//   )
// );
