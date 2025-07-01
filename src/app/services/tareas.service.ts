import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class tareasService {
    
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router:Router) {}

    private getAuthHeaders(): HttpHeaders {
        const token = sessionStorage.getItem('token');
        return new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });
    }

    getProyectos(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}/v1/tareas/getProyectos`, { headers });
    }

    getAsignados(id_proyecto: number): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get<any>(`${this.apiUrl}/v1/tareas/getAsignados/${id_proyecto}`, { headers });
    }

    eliminarActividad(data: {id: number, estado: number}): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/tareas/eliminarProyecto`, data, { headers });
    }

    getUsuarios(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}/v1/tareas/getUsersActivos`, { headers });
    }

    crearProyecto(data: {creado_por: number, nombre: string, descripcion: string}): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/tareas/crearProyecto`, data, { headers });
    }

    asignarUsuariosProyecto(data: { id_proyecto: number, usuarios: number[] }): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/tareas/agregarUsuarioProyecto`, data, { headers });
    }

    detallesProyecto(id_proyecto: number): Observable<any>{
        const headers = this.getAuthHeaders();
        return this.http.get<any>(`${this.apiUrl}/v1/tareas/getProyecto/${id_proyecto}`, { headers });
    }

    tareas(id_proyecto: number): Observable<any>{
        const headers = this.getAuthHeaders();
        return this.http.get<any>(`${this.apiUrl}/v1/tareas/getTareas/${id_proyecto}`, { headers });
    }

    editarProyecto(data: {id_proyecto: number, nombre: string, descripcion: string}): Observable<any>{
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/tareas/editarProyecto`, data, { headers });
    }

    cambiarEstadoTarea(data: { id_tarea: number, id_proyecto: number, estado: number }): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/tareas/cambiarEstadoTarea`, data, { headers });
    }

    crearTarea(data: { titulo: string, descripcion: string, id_proyecto: number, id_usuario: number }): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/v1/tareas/agregarTareas`, data, { headers });
    }
}