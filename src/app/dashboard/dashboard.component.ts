import { Component, OnInit } from '@angular/core';
import { IngresoEgresoService } from '../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  // Aca llamamos el ingreso-egresoService ya que se supone que el usuario ya esta logueado
  constructor( public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    // Que se inicie el ingreso-egreso
    // Para obtener los datos del usuario
    // Y relacionarlo con los items
    this.ingresoEgresoService.initIngresoEgresoListener();
  }

}
