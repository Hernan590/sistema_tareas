import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments.prod';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class loginService {
    
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router:Router) {}

    login(data: { email: string; password: string; }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/v1/login`, data);
    }

}