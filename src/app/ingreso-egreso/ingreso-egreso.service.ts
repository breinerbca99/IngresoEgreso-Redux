import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor(
    private afDB: AngularFirestore,
    public authService: AuthService,
    private store: Store<AppState>
  ) {}

  // tslint:disable-next-line: typedef
  initIngresoEgresoListener() {
    // Lo obtenemos desde el redux los cambiamos que tengamos en el auth
    this.ingresoEgresoListenerSubscription = this.store
      .select('auth')
      .pipe(
        // Solo si el usuario no es nulo
        filter((auth) => auth.user != null)
      )
      .subscribe((auth) => {
        // Este auth tiene al user
        // Habra un punto en el tiempo donde regrese null
        // Y Luego el estado de respuesta de firebase se actualiza y obtenemos
        // La respuesta del usuario y del uid
        /*  console.log(auth.user.uid); */
        this.ingresoEgresoItems(auth.user.uid);
      });
  }

  // tslint:disable-next-line: typedef
  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubscription = this.afDB
      .collection(`${uid}/ingresos-egresos/items`)
      // Observable que trabaja con los sockets de firebase
      .snapshotChanges()
      .pipe(
        map((docData: any) => {
          return docData.map((doc) => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe((coleccion: any[]) => {
        /* console.log(coleccion); */
        this.store.dispatch(new SetItemsAction(coleccion));
      });
  }

  cancelarSubscriptions(): void {
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso): any {
    // Extraemos los datos el usuario desde la interfaz auth
    const user = this.authService.getUsuario();

    // Guardamos en el documento en una nueva coleccion y añaadimos el modelo
    return this.afDB
      .doc(`${user.uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
    /* .then()
      .catch((err) => {
        console.log(err);
      }); */
  }

  // tslint:disable-next-line: typedef
  borrarIngresoEgreso(uid: string): any{
    const user = this.authService.getUsuario();
    // Hacemos referencia al documento
    this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`)
    .delete(); // Indicamos la operacion
  }
}
