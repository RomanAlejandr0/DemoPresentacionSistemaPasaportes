import { CommonModule } from '@angular/common';
import { Component, inject, Input, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from '../../archivos/empleados.service';


interface Empleado {
  nomina: string;
  nombre: string;
  foto?: string;
  area: string;
  grupo: string;
  turno: string;
  categoria: string;
  anosEnEmpresa: number;
  proximaEvaluacion: {
    dia: string;
    mes: string;
    categoriaObjetivo: string;
    hora: string;
    lugar: string;
  };
  asistencia: {
    faltas: number;
    cumpleRequisitos: boolean;
  };
  ultimoCambioCat: {
    fecha: string;
    promedio: string;
  };
  habilidades: {
    nombre: string;
    nivel: number;
    descripcion: string;
  }[];
  objetivosDesarrollo: {
    titulo: string;
    descripcion: string;
  }[];
  maquinas: {
    nombre: string;
    zona: string;
    estado: 'Autorizado' | 'En proceso' | 'No autorizado';
  }[];
  capacitaciones: {
    nombre: string;
    descripcion: string;
    estado: 'Completado' | 'En progreso' | 'Pendiente';
    progreso?: number;
  }[];
  cursosEnProgreso: {
    nombre: string;
    progreso: number;
    instructor: string;
    fechaLimite: string;
  }[];
  certificaciones: {
    nombre: string;
    fecha: string;
    descripcion: string;
  }[];
  cursosRecomendados: {
    nombre: string;
    descripcion: string;
    duracion: string;
  }[];
}

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  @Input({transform: numberAttribute})
  nomina!: number;

  route = inject(ActivatedRoute);
  router = inject(Router);
  empleadosService = inject(EmpleadosService);

  cargando = true;
  empleado: Empleado | null = null;

  // Pestañas de navegación
  tabs = [
    { id: 'trazabilidad', nombre: 'Trazabilidad' },
    { id: 'matriz', nombre: 'Matriz de Versatilidad' },
    { id: 'permisos', nombre: 'Permisos' },
    { id: 'academia', nombre: 'Academia' }
  ];
  tabActiva = 'trazabilidad';

  // Categorías en orden
  categorias = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  ngOnInit(): void {
    // Obtener el número de nómina de los parámetros de ruta
    this.route.params.subscribe(params => {
      const nomina = params['nomina'];
      if (nomina) {
        this.cargarDatosEmpleado(nomina);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  cargarDatosEmpleado(nomina: string): void {
    this.cargando = true;

    // Simulamos una carga con setTimeout
    setTimeout(() => {
      // En una aplicación real, aquí se consultaría al servicio
      // this.empleadosService.obtenerEmpleado(nomina).subscribe(data => {
      //   this.empleado = data;
      //   this.cargando = false;
      // });

      // Para la demo, usamos datos simulados
      this.empleado = this.obtenerDatosSimulados();
      this.cargando = false;
    }, 1500);
  }

  cambiarTab(tabId: string): void {
    this.tabActiva = tabId;
  }

  cerrarSesion(): void {
    this.router.navigate(['/login']);
  }

  obtenerIniciales(): string {
    if (!this.empleado) return '';

    const nombres = this.empleado.nombre.split(' ');
    if (nombres.length >= 2) {
      return (nombres[0][0] + nombres[1][0]).toUpperCase();
    }
    return nombres[0][0].toUpperCase();
  }

  obtenerPorcentajeProgreso(): number {
    if (!this.empleado) return 0;

    const indiceActual = this.obtenerIndiceCategoriaActual();
    return (indiceActual + 1) / this.categorias.length * 100;
  }

  obtenerIndiceCategoriaActual(): number {
    if (!this.empleado) return 0;

    return this.categorias.indexOf(this.empleado.categoria);
  }

  // Este método simula la respuesta del servicio para la demo
  private obtenerDatosSimulados(): Empleado {
    return {
      nomina: 'MT-12345',
      nombre: 'Juan Pérez González',
      area: 'Fundición',
      grupo: 'B',
      turno: 'Matutino',
      categoria: 'D',
      anosEnEmpresa: 3,
      proximaEvaluacion: {
        dia: '15',
        mes: 'ABR',
        categoriaObjetivo: 'F',
        hora: '9:00 AM',
        lugar: 'Sala de Capacitación 2'
      },
      asistencia: {
        faltas: 0,
        cumpleRequisitos: true
      },
      ultimoCambioCat: {
        fecha: '10/Octubre/2024',
        promedio: '9.2'
      },
      habilidades: [
        {
          nombre: 'Operación de fundición',
          nivel: 90,
          descripcion: 'Manejo de equipos y procesos de fundición de aluminio'
        },
        {
          nombre: 'Control de calidad',
          nivel: 70,
          descripcion: 'Inspección y validación de piezas según estándares'
        },
        {
          nombre: 'Seguridad industrial',
          nivel: 80,
          descripcion: 'Aplicación de protocolos de seguridad en planta'
        },
        {
          nombre: 'Mantenimiento preventivo',
          nivel: 60,
          descripcion: 'Identificación y prevención de fallas en equipos'
        }
      ],
      objetivosDesarrollo: [
        {
          titulo: 'Mejorar habilidades de control de calidad',
          descripcion: 'Enfocarse en la detección de defectos en piezas fundidas'
        },
        {
          titulo: 'Capacitación en nuevos equipos',
          descripcion: 'Completar entrenamiento para operar la Fundidora 5'
        },
        {
          titulo: 'Obtener certificación en seguridad avanzada',
          descripcion: 'Requisito para avanzar a categoría F'
        }
      ],
      maquinas: [
        { nombre: 'Fundidora 1', zona: 'Área A', estado: 'Autorizado' },
        { nombre: 'Fundidora 3', zona: 'Área B', estado: 'Autorizado' },
        { nombre: 'Horno A', zona: 'Área C', estado: 'En proceso' },
        { nombre: 'Mecanizado 2', zona: 'Área D', estado: 'No autorizado' },
        { nombre: 'Cinta 3', zona: 'Área A', estado: 'Autorizado' },
        { nombre: 'Control CNC', zona: 'Área E', estado: 'No autorizado' }
      ],
      capacitaciones: [
        {
          nombre: 'Seguridad en hornos industriales',
          estado: 'Completado',
          descripcion: 'Protocolos de seguridad para trabajo con hornos de alta temperatura'
        },
        {
          nombre: 'Manejo de materiales peligrosos',
          estado: 'En progreso',
          descripcion: 'Manipulación segura de químicos y materiales de fundición',
          progreso: 60
        },
        {
          nombre: 'Operación de equipos CNC',
          estado: 'Pendiente',
          descripcion: 'Capacitación básica para control numérico computarizado'
        }
      ],
      cursosEnProgreso: [
        {
          nombre: 'Mejora continua en procesos de fundición',
          progreso: 75,
          instructor: 'Carlos Ramírez',
          fechaLimite: '30/Abril/2025'
        },
        {
          nombre: 'Primeros auxilios nivel intermedio',
          progreso: 30,
          instructor: 'Ana Gómez',
          fechaLimite: '15/Mayo/2025'
        }
      ],
      certificaciones: [
        {
          nombre: 'Operador de Fundición Nivel 2',
          fecha: '15/Junio/2024',
          descripcion: 'Certificación para operar equipos de fundición de complejidad media'
        },
        {
          nombre: 'Seguridad Industrial Básica',
          fecha: '10/Marzo/2024',
          descripcion: 'Conocimientos fundamentales sobre seguridad en entornos industriales'
        }
      ],
      cursosRecomendados: [
        {
          nombre: 'Control avanzado de calidad',
          descripcion: 'Técnicas avanzadas para el control de calidad en piezas de aluminio',
          duracion: '20 horas'
        },
        {
          nombre: 'Liderazgo para supervisores',
          descripcion: 'Habilidades de liderazgo para roles de supervisión',
          duracion: '15 horas'
        },
        {
          nombre: 'Inglés técnico',
          descripcion: 'Vocabulario especializado para la industria automotriz',
          duracion: '30 horas'
        }
      ]
    };
  }
}
