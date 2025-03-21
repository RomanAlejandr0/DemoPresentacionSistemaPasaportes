import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Empleado } from './empleados';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Empleados';

  constructor() { }

  public validarExistenciaEmpleado(nomina: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.urlBase}/validar/${nomina}`);
  }


  public obtenerEmpleadoPorNomina(nomina: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.urlBase}/buscar/${nomina}`);
  }
}
