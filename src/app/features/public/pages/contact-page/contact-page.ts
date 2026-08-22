import { TitlePage } from '@/shared/components/title-page/title-page';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import es from '@/i18n/es.json';
import { publicLayoutPage } from '../../utils';
import {
  form,
  FormField,
  FormRoot,
  required,
  email,
  schema,
  maxLength,
} from '@angular/forms/signals';
import { ContactFormModel } from '../../interfaces';
import { UpperCasePipe } from '@angular/common';

const contactSchema = schema<ContactFormModel>((path) => {
  required(path.name, { message: 'Nombre es requerido' });
  maxLength(path.name, 4, { message: 'Maximo 4 caracteres' });
  required(path.email, { message: 'Correo electronico es requerido' });
  email(path.email, { message: 'Introduzca un correo válido' });
  required(path.message, { message: 'Mensaje es requerido' });
  maxLength(path.message, 200, { message: 'Maximo 200 caracteres' });
});

@Component({
  selector: 'out-contact-page',
  imports: [TitlePage, FormField, FormRoot, UpperCasePipe],
  templateUrl: './contact-page.html',
})
export class ContactPage {
  protected readonly i18n = es;
  router = inject(Router);

  layoutPage = signal<string>(publicLayoutPage);

  contactModel = signal<ContactFormModel>({
    name: '',
    email: '',
    message: '',
  });
  readonly contactForm = form(this.contactModel, contactSchema);
  isLoading = signal(false);

  navigateToHome() {
    this.router.navigate(['/']);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.contactModel();
    console.log(formData);
    this.isLoading.set(false);
  }
}
