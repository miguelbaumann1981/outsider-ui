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

@Component({
  selector: 'out-releases-crud-page',
  imports: [SubtitlePage, FormRoot, FormField],
  templateUrl: './releases-crud-page.html',
})
export class ReleasesCrudPage {
  protected readonly i18n = es;

  releasesModel = signal<any>({
    name: '',
    month: '',
    year: '',
    release: '',
    index: '',
    isDraft: false,
    isPublished: false,
  });
  releasesSchema = schema<any>((path) => {});

  readonly releasesForm = form(this.releasesModel, this.releasesSchema);

  saveAsDraft(): void {
    const formData = this.releasesModel();
    console.log('saveAsDraft:', formData);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.releasesModel();
    console.log('onSubmit:', formData);
  }
}
