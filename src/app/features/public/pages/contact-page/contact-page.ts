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
  minLength,
} from '@angular/forms/signals';
import { ContactFormModel } from '../../interfaces';
import { UpperCasePipe, NgClass } from '@angular/common';

@Component({
  selector: 'out-contact-page',
  imports: [TitlePage, FormField, FormRoot, UpperCasePipe, NgClass],
  templateUrl: './contact-page.html',
})
export class ContactPage {
  protected readonly i18n = es;
  router = inject(Router);

  layoutPage = signal<string>(publicLayoutPage);
  minCharactersName = signal(3);
  maxCharactersName = signal(30);
  minCharactersMessage = signal(10);
  isLoading = signal(false);
  contactModel = signal<ContactFormModel>({
    name: '',
    email: '',
    message: '',
  });

  contactSchema = schema<ContactFormModel>((path) => {
    required(path.name, { message: this.i18n.contact.validations.nameRequired });
    minLength(path.name, 3, {
      message: `${this.i18n.contact.validations.nameMinLength} ${this.minCharactersName()}`,
    });
    maxLength(path.name, 30, {
      message: `${this.i18n.contact.validations.nameMaxLength} ${this.maxCharactersName()}`,
    });
    required(path.email, { message: this.i18n.contact.validations.emailRequired });
    email(path.email, { message: this.i18n.contact.validations.emailPattern });
    required(path.message, { message: this.i18n.contact.validations.messageRequired });
    minLength(path.message, 10, {
      message: `${this.i18n.contact.validations.messageMinLength} ${this.minCharactersMessage()}`,
    });
  });

  readonly contactForm = form(this.contactModel, this.contactSchema);

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
