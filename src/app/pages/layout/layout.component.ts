import { Component, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule, 
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent implements AfterViewInit {
  nombreUsuario: string = '';
  rolUsuario: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.rolUsuario = Number(sessionStorage.getItem('rol'));
    this.nombreUsuario = sessionStorage.getItem('nombre') || 'Usuario';
  }

  ngAfterViewInit(): void {
    const hamburger = document.querySelector("#toggle-btn");
    const sidebar = document.querySelector("#sidebar");

    if (hamburger && sidebar) {
      hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("expand");
      });
    }
  }

  cerrarSesion(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión será cerrada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Cerrando sesión...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); 
          }
        });

        setTimeout(() => {
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('rol');
          sessionStorage.removeItem('nombre');
          Swal.close(); 
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }
}