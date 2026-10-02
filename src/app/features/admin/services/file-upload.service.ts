import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment.development';
import { forkJoin, map, Observable, of, tap } from 'rxjs';

@Service()
export class FileUploadService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.API_URL;

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((img) => this.uploadImage(img));

    return forkJoin(uploadObservables).pipe(tap((imgNames) => console.log(imgNames)));
  }

  uploadImage(image: File | undefined): Observable<string> {
    const formData = new FormData();
    formData.append('file', image!);
    console.log('Uploading image:', image);

    return this.http
      .post<{ fileName: string }>(`${this.baseUrl}/api/upload/single`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
