import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment.development';
import { delay, map, Observable } from 'rxjs';
import { AboutUsApi } from '../interfaces';
import { AboutUsCrud } from '@/features/admin/interfaces';

@Service()
export class AboutUsService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.API_URL;

  getAboutUsInfo(): Observable<AboutUsApi[]> {
    return this.http.get<AboutUsApi[]>(`${this.baseUrl}/api/about-us`);
  }

  getAboutUsInfoById(id: string): Observable<AboutUsApi> {
    return this.http
      .get<AboutUsApi[]>(`${this.baseUrl}/api/about-us`)
      .pipe(map((data) => data.find((item) => item.id === id) as AboutUsApi));
  }

  createAboutUsInfo(body: AboutUsCrud): Observable<AboutUsApi> {
    return this.http.post<AboutUsApi>(`${this.baseUrl}/api/about-us`, body).pipe(delay(1500));
  }

  updateAboutUsInfo(id: string, update: AboutUsCrud): Observable<AboutUsApi> {
    return this.http
      .put<AboutUsApi>(`${this.baseUrl}/api/about-us/${id}`, update)
      .pipe(delay(1500));
  }
}
