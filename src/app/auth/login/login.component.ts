import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy{
  cargando: boolean;
  subscription: Subscription;
  constructor(public authService: AuthService, public store: Store<AppState>) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading);
  }

  onSubmit(data: any): void {
    console.log(data);
    this.authService.login(data.email, data.password);
  }
}
