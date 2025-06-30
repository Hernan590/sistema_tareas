import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tareasService } from '../../services/tareas.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-tareas',
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export default class TareasComponent implements OnInit {
  proyectos: any[] = [];
  usuarios: any[] = [];
  usuariosAsignados: any[] = [];
  proyectoDatos: any = {};
  tareasInfo: any[] = [];
  usuariosProyecto: any[] = [];
  crearPro: any = {};
  nuevaTarea: any = {};
  filtroTitulo: string = '';
  filtroDescripcion: string = '';
  filtroEstado: string = '';
  editar: boolean = false;
  idProyectoActual: number = 0;
  rolUsuario: number = 0;


  constructor(private tareasService: tareasService) {}

  ngOnInit(): void {
    this.rolUsuario = Number(sessionStorage.getItem('rol'));
    this.obtenerUsuariosActivos()
    this.tareasService.getProyectos().subscribe({
      next: (data) => {
        this.proyectos = data.proyectos;
      },
      error: (err) => {
        console.error('Error al obtener los proyectos:', err);
      }
    });
  }

  get proyectosFiltrados() {
    return this.proyectos.filter(p => {
      const coincideTitulo = p.nombre.toLowerCase().includes(this.filtroTitulo.toLowerCase());
      const coincideDescripcion = p.descripcion.toLowerCase().includes(this.filtroDescripcion.toLowerCase());
      const coincideEstado = this.filtroEstado ? p.nombre_estado === this.filtroEstado : true;

      return coincideTitulo && coincideDescripcion && coincideEstado;
    });
  }

  abrirModalCrearTarea() {
    const modalElement = document.getElementById('crearActividad');
    if (modalElement) {
      const modal = new Modal(modalElement)
      modal.show();
    }
  }

  crearProyecto() {
    const id_usuario = Number(sessionStorage.getItem('id'));

    const data = {
      creado_por: id_usuario,
      nombre: this.crearPro.titulo,
      descripcion: this.crearPro.descripcion
    }

    if (!this.crearPro.titulo) {
      Swal.fire('Error', 'El campo Titulo no puede estar vacío.', 'error');
      return;
    }

    if (!this.crearPro.descripcion) {
      Swal.fire('Error', 'El campo Descripcion no puede estar vacío.', 'error');
      return;
    }

    const usuariosSeleccionados = this.usuarios.filter(u => u.seleccionado);
    if (usuariosSeleccionados.length === 0) {
      Swal.fire('Error', 'Debes asignar al menos un usuario.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Revisa bien la informacion antes de crear la actividad.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Crear!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareasService.crearProyecto(data).subscribe(
          response => {
            const idProyectoCreado = response.id_proyecto;
            this.asignarUsuariosAlProyecto(idProyectoCreado);
            Swal.fire('Actividad Creada!', 'Se ha creado la actividad correctamente.', 'success');
            const modalElement = document.getElementById('crearActividad');
            if (modalElement) {
              const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
              modalInstance.hide();
            }
            this.obtenerProyectos();
            this.limpiarCampos();
          },
          error => {
            console.error('Error al crear la actividad:', error);
            Swal.fire('Error', 'Ocurrio un problema al tratar de crear la actividad', 'error');
          }
        );
      }
    });
  }

  asignarUsuariosAlProyecto(idProyecto: number) {
    const usuariosSeleccionados = this.usuarios
      .filter(u => u.seleccionado)
      .map(u => u.id_usuario);

    if (usuariosSeleccionados.length === 0) return;

    const dataAsignacion = {
      id_proyecto: idProyecto,
      usuarios: usuariosSeleccionados
    };

    this.tareasService.asignarUsuariosProyecto(dataAsignacion).subscribe({
      next: res => {
        this.obtenerProyectos();
      },
      error: err => {
        console.error('Error al asignar usuarios', err);
      }
  });
  }

  limpiarCampos() {
    this.crearPro = {
      titulo: '',
      descripcion: ''
    };

    this.usuarios.forEach(u => u.seleccionado = false);
  }

  verDetallesProyecto(id_proyecto: number): void {
    if (id_proyecto) {
      this.tareasService.detallesProyecto(id_proyecto).subscribe({
        next: (res) => {
          this.proyectoDatos = res.detallesProyecto;
          const modalElement = document.getElementById('detallesActividad');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
        },
        error: (err) => {
          console.error('Error al obtener detalles:', err);
        }
      });
    }
  }

  tareas(id_proyecto: number) {
    if (id_proyecto) {
      this.tareasService.tareas(id_proyecto).subscribe({
        next: (res) => {
          this.idProyectoActual = id_proyecto;
          this.tareasInfo = res.detallesTareas;
          this.usuariosProyecto = res.usuarios;
          const modalElement = document.getElementById('detallesTareas');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
        },
        error: (err) => {
          console.error('Error al obtener detalles:', err);
        }
      });
    }
  }

  agregarTarea(id_proyecto: number) {

    if (!this.nuevaTarea.titulo || !this.nuevaTarea.descripcion || !this.nuevaTarea.id_usuario) {
      Swal.fire('Campos incompletos', 'Debes completar todos los campos', 'warning');
      return;
    }

    const data = {
      titulo: this.nuevaTarea.titulo,
      descripcion: this.nuevaTarea.descripcion,
      id_usuario: this.nuevaTarea.id_usuario,
      id_proyecto: id_proyecto
    };

    this.tareasService.crearTarea(data).subscribe({
      next: (res) => {
        Swal.fire('Éxito', 'Tarea agregada correctamente', 'success');
        this.nuevaTarea = { titulo: '', descripcion: '', id_usuario: '' };

        const modalElement = document.getElementById('detallesTareas');
        if (modalElement) {
          const modalInstance = Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }

          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
        }
        
        this.tareas(id_proyecto);
        this.obtenerProyectos();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo agregar la tarea', 'error');
      }
    });
  }

  guardarCambios(id_proyecto: number) {

    const data = {
      id_proyecto: id_proyecto,
      nombre: this.proyectoDatos.nombre,
      descripcion: this.proyectoDatos.descripcion
    }

    if (!this.proyectoDatos.nombre) {
      Swal.fire('Error', 'El campo Titulo no puede estar vacío.', 'error');
      return;
    }

    if (!this.proyectoDatos.descripcion) {
      Swal.fire('Error', 'El campo Descripcion no puede estar vacío.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Revisa bien si es la informacion correcta antes de realizar el cambio.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareasService.editarProyecto(data).subscribe(
          response => {
            Swal.fire('Actividad Editada!', 'Se ha editado la informacion de la actividad correctamente.', 'success');
            const modalElement = document.getElementById('detallesActividad');
            if (modalElement) {
              const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
              modalInstance.hide();
            }
            this.obtenerProyectos();
            this.editar = false
          },
          error => {
            console.error('Error al cambiar datos del proyecto:', error);
            Swal.fire('Error', 'Ocurrio un problema al tratar de cambiar los datos', 'error');
          }
        );
      }
    });
  }

  eliminarTarea(id: number, estado: number) {
    const nuevoEstado = estado === 1 ? 0 : 1;

    const data = {
      id: id,
      estado: nuevoEstado
    };

    Swal.fire({
      title: '¿Está seguro?',
      text: 'La actividad sera eliminada junto con todas sus tareas y asignados a esta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareasService.eliminarActividad(data).subscribe({
          next: () => {
            Swal.fire(
              'Actividad Eliminada!',
              `Se ha eliminado correctamente la actividad.`,
              'success'
            );
            this.obtenerProyectos();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la actividad.', 'error');
          }
        });
      }
    });
  }

  verAsignados(id_proyecto: number) {
    if (id_proyecto) {
      this.tareasService.getAsignados(id_proyecto).subscribe({
        next: (res) => {
          this.usuariosAsignados = res.asignados;
          const modalElement = document.getElementById('listaAsignados');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
        },
        error: (err) => {
          console.error('Error al obtener asignados:', err);
        }
      });
    }
  }

  obtenerProyectos() {
    this.tareasService.getProyectos().subscribe((data) => {
      this.proyectos = data.proyectos;
    });
  }

  cambiarEstadoTarea(id_tarea: number, id_proyecto: number, nuevoEstado: 'finalizado' | 'cancelado') {
    const estado = nuevoEstado === 'finalizado' ? 2 : 3;
    Swal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'finalizado' ? 'finalizar' : 'cancelar'} esta tarea?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed) {
        this.tareasService.cambiarEstadoTarea({ id_tarea, id_proyecto, estado }).subscribe({
          next: () => {
            Swal.fire('Listo', 'El estado de la tarea ha sido actualizado.', 'success');
            this.obtenerProyectos()
            this.obtenerTareasDelProyecto(id_proyecto);
          },
          error: err => {
            console.error('Error al cambiar el estado de la tarea:', err);
            Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
          }
        });
      }
    });
  }

  obtenerTareasDelProyecto(id_proyecto: number) {
    this.tareasService.tareas(id_proyecto).subscribe((data) => {
      this.tareasInfo = data.detallesTareas;
    });
  }

  obtenerUsuariosActivos() {
    this.tareasService.getUsuarios().subscribe((data) => {
      this.usuarios = data.usuarios;
    });
  }
}
