import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();
  constructor(
    private store: Store<AppState>,
    public ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.store.select('ingresoEgreso').subscribe((ingresoEgreso) => {
      /*  console.log(ingresoEgreso.items); */

      this.items = ingresoEgreso.items;
      console.log(this.items);
    });
  }

  // tslint:disable-next-line: typedef
  borrarItem(item: IngresoEgreso) {
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid).then(() => {
      Swal.fire({
        title: 'Item eliminado!',
        text: item.descripcion,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    });
  }
}
