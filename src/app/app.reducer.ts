import { ActionReducerMap } from '@ngrx/store';
/* Permite fucionar varios reducer en uno solo y q la aplicacion conozca como esta trabajando las diferentes partes del store */
// import { ActionReducerMap } from '@ngrx/store';
/* Este tiene la definicion global del estado */

import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import * as fromIngresoEgreso from './ingreso-egreso/ingreso-egreso.reducer';

export interface AppState {
  ui: fromUI.State;
  auth: fromAuth.AuthState;
  ingresoEgreso: fromIngresoEgreso.IngresoEgresoState;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer,
  ingresoEgreso: fromIngresoEgreso.ingresoEgresoReducer,
};
