import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ReleasesApi } from '@/features/public/interfaces';
import { ReleasesService } from '@/features/public/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'out-release-crud-detail-page',
  imports: [SubtitlePage, FormField, FormRoot],
  templateUrl: './release-crud-detail-page.html',
})
export class ReleaseCrudDetailPage implements OnInit {
  protected readonly i18n = es;

  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private releasesService = inject(ReleasesService);

  activeParam = signal<string | 'new'>('');
  selectedRelease = signal<ReleasesApi>({} as ReleasesApi);
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

  ngOnInit(): void {
    this.handleCrudRelease();
  }

  handleCrudRelease(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      this.activeParam.set(params['id']);

      if (this.activeParam() === 'new') {
        console.log('Es new!!');
      } else {
        this.getSelectedRelease(this.activeParam());
        console.log('Editar form');
      }
    });
  }

  getSelectedRelease(id: string): void {
    this.releasesService
      .getReleaseById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.selectedRelease.set(data);
          this.releaseModel.set(this.selectedRelease());
        },
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.releaseModel().isDraft = true;
    this.releaseModel().isPublished = false;
    const formData = this.releaseModel();
    console.log('onSubmit:', formData);

    if (this.activeParam() === 'new') {
      this.releasesService
        .createRelease(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            console.log('Nuevo!!');
          },
          error: () => {
            console.log('error');
          },
          complete: () => {
            this.navigateToPreviousPage();
          },
        });
    } else {
      this.releasesService
        .updateRelease(this.activeParam(), formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            console.log('Actualizado!!');
          },
          error: () => {
            console.log('error');
          },
          complete: () => {
            this.navigateToPreviousPage();
          },
        });
    }
  }

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/releases-crud']);
  }
}
