import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, signal } from '@angular/core';
import es from '@/i18n/es.json';
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
import { InputTextRichForm } from '@/shared/components/input-text-rich-form/input-text-rich-form';
import { AboutUsCrud } from '../../interfaces';

@Component({
  selector: 'out-about-us-crud-page',
  imports: [SubtitlePage, FormRoot, FormField, InputTextRichForm],
  templateUrl: './about-us-crud-page.html',
})
export class AboutUsCrudPage {
  protected readonly i18n = es;

  aboutUsModel = signal<AboutUsCrud>({
    mainText: '',
    collaborators: [
      { name: '', text: '', picture: '' },
      { name: '', text: '', picture: '' },
    ],
    isDraft: false,
    isPublished: false,
  });
  aboutUsSchema = schema<AboutUsCrud>((path) => {});

  readonly aboutUsForm = form(this.aboutUsModel, this.aboutUsSchema);

  onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.aboutUsModel();
    console.log('Form Data:', formData);
  }
}
