import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from '../shared/ui.accions';
import { AppState } from '../app.reducer';

import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Vereficara cuando un usuario sufre un cambio desde firebase
  // Prevenir si que tengamos muchos usuarios conectados
  private userSubscription: Subscription = new Subscription();
  private usuario: User;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
  ) {}

  // Va escuchar cuando cambie el estado del usuario
  // Esto se va llamar una vez a lo largo de toda la aplicacion
  initAuthListener(): void {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      // si existe el usuario en firebase
      if (fbUser) {
        // queremos tener la referencia a ese objeto
        this.userSubscription = this.afDB
          .doc(`${fbUser.uid}/usuario`)
          .valueChanges()
          .subscribe((usuarioObj: any) => {
            // Aca imprimo el objeto de firebase
            // console.log(usuarioObj);
            const newUser = new User(usuarioObj);
            /* console.log(newUser); */
            this.store.dispatch(new SetUserAction(newUser));
            this.usuario = newUser;
          });
      } else {
        // cancelamos la subscription si el usuario se ha desconectado
        this.userSubscription.unsubscribe();
        this.usuario = null;
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string): void {
    this.store.dispatch(new ActivarLoadingAction());
    // this.afAuth.auth.createuser
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        // console.log(resp);
        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email,
        };
        this.afDB
          .doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.router.navigate(['/']);
            this.store.dispatch(new DesactivarLoadingAction());
          });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: 'Error al crear el usuario!',
          text: error,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }

  login(email: string, password: string): void {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        console.log('Logueado');
        console.log(resp);
        this.router.navigate(['/']);
        this.store.dispatch(new DesactivarLoadingAction());
      })
      .catch((error) => {
        console.error(error);
        // Para mostrar el error
        Swal.fire({
          title: 'Error en el login!',
          text: error,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }

  logout(): void {
    this.afAuth.signOut();
    this.store.dispatch( new UnsetUserAction());
  }

  // tslint:disable-next-line: typedef
  isAuth() {
    // Esto regresa un observable
    // Pero el can activate espera un true o false
    return this.afAuth.authState.pipe(
      map((fbUser) => {
        // Va pasar si el usuario no esta autenticado
        if (fbUser == null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;
      })
    );
  }

  getUsuario(): any{
    return {...this.usuario};
  }
}
