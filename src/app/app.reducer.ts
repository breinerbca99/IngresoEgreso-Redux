import { ActionReducerMap } from '@ngrx/store';
/* Permite fucionar varios reducer en uno solo y q la aplicacion conozca como esta trabajando las diferentes partes del store */
// import { ActionReducerMap } from '@ngrx/store';
/* Este tiene la definicion global del estado */

import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface AppState {
  ui: fromUI.State;
  auth: fromAuth.AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer
};
