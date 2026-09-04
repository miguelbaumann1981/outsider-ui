import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { ReleasesCrud } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'out-release-crud-detail-page',
  imports: [SubtitlePage, FormField, FormRoot],
  templateUrl: './release-crud-detail-page.html',
})
export class ReleaseCrudDetailPage {
  protected readonly i18n = es;

  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  releaseModel = signal<ReleasesCrud>({
    name: '',
    month: '',
    year: 0,
    release: '',
    index: 0,
    isDraft: false,
    isPublished: false,
  });
  releaseSchema = schema<any>((path) => {});

  readonly releaseForm = form(this.releaseModel, this.releaseSchema);

  saveAsDraft(): void {
    this.releaseModel().isDraft = true;
    const formData = this.releaseModel();
    console.log('saveAsDraft:', formData);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.releaseModel().isDraft = false;
    this.releaseModel().isPublished = true;
    const formData = this.releaseModel();
    console.log('onSubmit:', formData);
  }

  navigateBack(): void {
    this.router.navigate(['/admin/releases-crud']);
  }
}
