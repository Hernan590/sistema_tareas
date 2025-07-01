import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments.prod';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class usuariosService {
    
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router:Router) {}

    private getAuthHeaders(): HttpHeaders {
        const token = sessionStorage.getItem('token');
        return new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });
    }

    getUsuarios(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}/v1/usuarios/getUsuarios`, { headers });
    }

    inactivar(data: {id: number, estado: number}): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/usuarios/desactivarUsuario`, data, { headers });
    }

    detalles(id_usuario: number): Observable<any>{
        const headers = this.getAuthHeaders();
        return this.http.get<any>(`${this.apiUrl}/v1/usuarios/consultarUsuario/${id_usuario}`, { headers });
    }

    editarUsuario(data: {id: number, nombre: string, email: string, rol: number}): Observable<any>{
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/usuarios/editarUsuario`, data, { headers });
    }

    crearUsuario(data: {nombre: string, email: string, password: string, rol: number}): Observable<any>{
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/usuarios/crearUsuario`, data, { headers });
    }

}