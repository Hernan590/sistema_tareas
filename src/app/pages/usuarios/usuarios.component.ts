import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { usuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export default class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  terminoBusqueda: string = '';
  filtroRol: string = '';
  filtroEstado: string = '';
  usuarioSeleccionado: any = {};
  crearUsuario: any = {};
  editar: boolean = false;

  constructor(private usuariosService: usuariosService) {}

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.usuarios;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  get usuariosFiltrados() {
    return this.usuarios.filter(u => {
      const cumpleBusqueda =
        u.nombre_usuario.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      const cumpleRol = this.filtroRol ? u.rol === this.filtroRol : true;
      const cumpleEstado = this.filtroEstado !== '' ? u.estado === Number(this.filtroEstado) : true;

      return cumpleBusqueda && cumpleRol && cumpleEstado;
    });
  }

  inactivarUsuario(id: number, estado: number) {
    const nuevoEstado = estado === 1 ? 0 : 1;

    const data = {
      id: id,
      estado: nuevoEstado
    };

    Swal.fire({
      title: nuevoEstado === 0 ? '¿Está seguro?' : '¿Desea reactivar este usuario?',
      text: nuevoEstado === 0 ? 'Este usuario será inactivado' : 'Este usuario será activado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: nuevoEstado === 0 ? 'Sí, inactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.inactivar(data).subscribe({
          next: () => {
            Swal.fire(
              nuevoEstado === 0 ? 'Inactivado' : 'Activado',
              `El usuario ha sido ${nuevoEstado === 0 ? 'inactivado' : 'activado'}.`,
              'success'
            );
            this.obtenerUsuarios();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el estado del usuario.', 'error');
          }
        });
      }
    });
  }

  obtenerUsuarios() {
    this.usuariosService.getUsuarios().subscribe((data) => {
      this.usuarios = data.usuarios;
    });
  }

  detallesUsuario(id_usuario: number): void {
    if (id_usuario) {
      this.usuariosService.detalles(id_usuario).subscribe({
        next: (res) => {
          this.usuarioSeleccionado = res.detallesUsuario;
          const modalElement = document.getElementById('detallesUsuario');
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

  abrirModalCrear() {
    const modalElement = document.getElementById('crearUsuario');
    if (modalElement) {
      const modal = new Modal(modalElement)
      modal.show();
    }
  }

  guardarCambios(id_usuario: number) {

    const data = {
      id: id_usuario,
      nombre: this.usuarioSeleccionado.nombre_usuario,
      email: this.usuarioSeleccionado.email,
      rol: this.usuarioSeleccionado.rol
    }

    if (!this.usuarioSeleccionado.nombre_usuario) {
      Swal.fire('Error', 'El campo nombre no puede estar vacío.', 'error');
      return;
    }

    if (!this.usuarioSeleccionado.email) {
      Swal.fire('Error', 'El campo correo no puede estar vacío.', 'error');
      return;
    }

    if (!this.usuarioSeleccionado.rol) {
      Swal.fire('Error', 'El campo rol no puede estar vacío.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Revisa bien si es la informacion correcta para este usuario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.editarUsuario(data).subscribe(
          response => {
            Swal.fire('Usuario Actualizado!', 'Se ha actualizado la informacion del usuario correctamente.', 'success');
            const modalElement = document.getElementById('detallesUsuario');
            if (modalElement) {
              const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
              modalInstance.hide();
            }
            this.obtenerUsuarios();
            this.editar = false
          },
          error => {
            console.error('Error al cambiar datos usuario:', error);
            Swal.fire('Error', 'Ocurrio un problema al tratar de cambiar los datos', 'error');
          }
        );
      }
    });
  }

  crearUser(){

    const data = {
      nombre: this.crearUsuario.nombre_usuario,
      email: this.crearUsuario.correo,
      password: this.crearUsuario.password,
      rol: this.crearUsuario.rol
    }

    if (!this.crearUsuario.nombre_usuario) {
      Swal.fire('Error', 'El campo nombre no puede estar vacío.', 'error');
      return;
    }

    if (!this.crearUsuario.correo) {
      Swal.fire('Error', 'El campo correo no puede estar vacío.', 'error');
      return;
    }

    if (!this.crearUsuario.password) {
      Swal.fire('Error', 'El campo Contraseña no puede estar vacío.', 'error');
      return;
    }

    if (!this.crearUsuario.rol) {
      Swal.fire('Error', 'El campo rol no puede estar vacío.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Revisa bien antes de crear el usuario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Crear!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.crearUsuario(data).subscribe(
          response => {
            Swal.fire('Usuario Creado!', 'Se ha creado un usuario correctamente.', 'success');
            const modalElement = document.getElementById('crearUsuario');
            if (modalElement) {
              const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
              modalInstance.hide();
            }
            this.obtenerUsuarios();
            this.limpiarCamposCrear();
          },
          error => {
            console.error('Error al crear usuario:', error);
            Swal.fire('Error', 'Ocurrio un problema al tratar de crear un usuario', 'error');
          }
        );
      }
    });

  }

  limpiarCamposCrear(){
    this.crearUsuario.nombre_usuario = "",
    this.crearUsuario.correo = "",
    this.crearUsuario.password = "",
    this.crearUsuario.rol = ""
  }

}