import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { loginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
            CommonModule,
            FormsModule,
          ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  email: string = '';
  password: string = '';
  verContra: boolean = false;
  recordar: boolean = false; 

  constructor(private loginService: loginService, private router: Router) {}

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('recordar_email');
    const savedPass = localStorage.getItem('recordar_pass');

    if (savedEmail && savedPass) {
      this.email = savedEmail;
      this.password = savedPass;
      this.recordar = true;
    }
  }

  onSubmit() {

    const data = {
      email: this.email,
      password: this.password
    }

    if (this.recordar) {
      localStorage.setItem('recordar_email', this.email);
      localStorage.setItem('recordar_pass', this.password);
    } else {
      localStorage.removeItem('recordar_email');
      localStorage.removeItem('recordar_pass');
    }

    this.loginService.login(data).subscribe({
      next: (response) => {
        const id = response.id;
        const token = response.token;
        const rol = response.rol;
        const nombre = response.nombre;
        sessionStorage.setItem('id', id);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('rol', rol);
        sessionStorage.setItem('nombre', nombre);
        Swal.fire('Éxito', `Bienvenido, ${nombre}`, 'success');
        this.router.navigate(['/panel/dashboard'])
      },
      error: (error) => {
        Swal.fire('Error', error.error.error || 'Credenciales incorrectas', 'error');
      }
    });
  }

  verPassword() {
    this.verContra = !this.verContra;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    if (this.verContra) {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }

}