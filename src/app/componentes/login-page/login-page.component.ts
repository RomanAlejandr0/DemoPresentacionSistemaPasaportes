import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { EmpleadosService } from '../../archivos/empleados.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


type EstadoEscaneo = 'inicial' | 'escaneando' | 'validando' | 'completado';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  @ViewChild('escanerInput') escanerInput!: ElementRef<HTMLInputElement>;

  empleadosServices = inject(EmpleadosService);
  router = inject(Router);

  mensaje: string = '';
  empleadoExiste?: boolean;
  estadoEscaneo: EstadoEscaneo = 'inicial';
  mostrarEntradaManual: boolean = false;
  idManual: string = '';

  ngOnInit(): void {
    // Documentación: Si quisieramos, podríamos iniciar el escaneo automáticamente
    // this.iniciarEscaneo();
  }

  iniciarEscaneo(): void {
    this.estadoEscaneo = 'escaneando';
    this.empleadoExiste = undefined;

    // Enfocamos el input para que pueda recibir el evento de paste
    setTimeout(() => {
      this.escanerInput.nativeElement.focus();
    }, 100);
  }

  validarExistenciaUsuario(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    let pastedText = clipboardData?.getData('text');

    if (pastedText) {
      this.estadoEscaneo = 'validando';
      const nomina = this.stringToNumber(pastedText);

      if (!Number.isNaN(nomina)) {
        this.empleadosServices.validarExistenciaEmpleado(nomina).subscribe(existe => {
          this.empleadoExiste = existe;
          this.estadoEscaneo = 'completado';

          // Si existe, redirigimos al perfil después de un breve delay
          if (existe) {
            setTimeout(() => {
              this.router.navigate(['/profile', nomina]);
            }, 2000);
          }
        });
      } else {
        // El texto escaneado no es un número válido
        this.empleadoExiste = false;
        this.estadoEscaneo = 'completado';
      }
    }
  }

  validarManualmente(): void {
    if (!this.idManual.trim()) return;

    this.estadoEscaneo = 'validando';
    const nomina = this.stringToNumber(this.idManual);

    if (!Number.isNaN(nomina)) {
      this.empleadosServices.validarExistenciaEmpleado(nomina).subscribe(existe => {
        this.empleadoExiste = existe;
        this.estadoEscaneo = 'completado';

        // Si existe, redirigimos al perfil después de un breve delay
        if (existe) {
          setTimeout(() => {
            this.router.navigate(['/profile', nomina]);
          }, 2000);
        }
      });
    } else {
      // El ID ingresado no es un número válido
      this.empleadoExiste = false;
      this.estadoEscaneo = 'completado';
    }
  }

  toggleEntradaManual(): void {
    this.mostrarEntradaManual = !this.mostrarEntradaManual;
    this.resetearEstado();

    if (this.mostrarEntradaManual) {
      setTimeout(() => {
        // Enfocamos el input manual si se muestra
        const inputElement = document.querySelector('input[type="text"]:not(.opacity-0)') as HTMLInputElement;
        if (inputElement) inputElement.focus();
      }, 100);
    }
  }

  resetearEstado(): void {
    this.estadoEscaneo = 'inicial';
    this.empleadoExiste = undefined;
    this.idManual = '';
  }

  cancelarEscaneo(): void {
    this.estadoEscaneo = 'inicial';
    this.empleadoExiste = undefined;
  }


  selectAllText(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  stringToNumber(value: string): number {
    const num = Number(value);
    return isNaN(num) ? NaN : num;
  }
}
