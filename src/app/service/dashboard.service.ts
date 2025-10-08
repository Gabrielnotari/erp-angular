import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service'; // 👈 ajuste o caminho conforme sua estrutura

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
private baseUrl = `${ApiService.BASE_URL}/dashboard`;

  constructor(private http: HttpClient, private api: ApiService) {}

  getDashboard(): Observable<any> {
    // Usa método público do ApiService para gerar o header
    const headers = this.api['getHeader'] ? this.api['getHeader']() : new HttpHeaders();
    return this.http.get(this.baseUrl, { headers });
  }
}
