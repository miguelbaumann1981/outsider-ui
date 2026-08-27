import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment.development';
import { ContactFormModel } from '../interfaces';

@Service()
export class ContactService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.url;

  sendEmail(data: ContactFormModel) {
    return this.http.post(`${this.baseUrl}/api/contact`, data);
  }
}
