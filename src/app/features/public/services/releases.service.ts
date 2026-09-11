import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment.development';
import { ReleasesApi } from '../interfaces';
import { delay, map, Observable } from 'rxjs';
import { ReleasesCrud } from '@/features/admin/interfaces';

@Service()
export class ReleasesService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.API_URL;

  getReleases(): Observable<ReleasesApi[]> {
    return this.http.get<ReleasesApi[]>(`${this.baseUrl}/api/releases`);
  }

  getReleaseById(id: string): Observable<ReleasesApi> {
    return this.http
      .get<ReleasesApi[]>(`${this.baseUrl}/api/releases`)
      .pipe(map((data) => data.find((item) => item.id === id) as ReleasesApi));
  }

  createRelease(body: ReleasesCrud): Observable<ReleasesApi> {
    return this.http.post<ReleasesApi>(`${this.baseUrl}/api/releases`, body).pipe(delay(1500));
  }

  updateRelease(id: string, update: ReleasesCrud): Observable<ReleasesApi> {
    return this.http
      .put<ReleasesApi>(`${this.baseUrl}/api/releases/${id}`, update)
      .pipe(delay(1500));
  }

  updateBulk(items: ReleasesApi[]) {
    return this.http.patch(`${this.baseUrl}/api/releases/bulk`, items).pipe(delay(1500));
  }
}
