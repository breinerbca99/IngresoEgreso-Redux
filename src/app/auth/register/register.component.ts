import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscription: Subscription;
  constructor(public authService: AuthService, public store: Store<AppState>) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading);
  }

  onSubmit( data: any): void{
    console.log(data);
    this.authService.crearUsuario( data.nombre, data.email, data.password);
  }

}
