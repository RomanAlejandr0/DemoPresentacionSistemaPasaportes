export interface Empleado {
  id: number;
  numeroNomina: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaIngreso: Date;
  foto?: string;
}
