import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment.development';
import { ReleasesApi } from '../interfaces';
import { map, Observable } from 'rxjs';

@Service()
export class ReleasesService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.url;

  getReleases(): Observable<ReleasesApi> {
    return this.http.get<ReleasesApi>(`${this.baseUrl}/api/releases`);
  }
}
