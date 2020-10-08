import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService) {}

  // tslint:disable-next-line: typedef
  canActivate() {
    // Aca van a estar las rutas que púede y no podra ver el usuario
    /* const autenticado = false;
    if (autenticado === false) {
      this.router.navigate(['/login']);
    } */
    return this.authService.isAuth();
  }
}
