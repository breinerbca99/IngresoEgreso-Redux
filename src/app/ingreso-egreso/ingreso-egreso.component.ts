import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  forma: FormGroup;
  tipo = 'ingreso';

  loadingSubs: Subscription = new Subscription();
  cargando: boolean;

  constructor(
    public ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  ngOnInit(): void {
    // vamos a escuchar cuando la aplicacion esta en estado de carga
    this.loadingSubs = this.store
      .select('ui')
      .subscribe((ui) => (this.cargando = ui.isLoading));
    // Como tenemos la subscription tenemos que manejar el OnDestroy

    // Condiciones de nuestro formulario
    this.forma = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl(0, Validators.min(0)),
    });
  }

  crearIngresoEgreso(): void {
    // TEnemos que hacer el dispacht para que cambie el estado
    this.store.dispatch(new ActivarLoadingAction());

    /* console.log(this.forma.value);
    console.log(this.tipo); */
    const ingresoEgreso = new IngresoEgreso({
      ...this.forma.value,
      tipo: this.tipo,
    });
    /* console.log(ingresoEgreso); */
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch( new DesactivarLoadingAction());
        this.forma.reset({
          monto: 0,
        });
        // Para mostrar el error
        Swal.fire({
          title: 'Creado!',
          text: ingresoEgreso.descripcion,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // RESETEAMOS
  }
}
