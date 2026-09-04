import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { ReleasesService } from '@/features/public/services';
import { Router } from '@angular/router';
import { ReleasesApi } from '@/features/public/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Release } from '@/features/public/types';

@Component({
  selector: 'out-releases-crud-page',
  imports: [SubtitlePage],
  templateUrl: './releases-crud-page.html',
})
export class ReleasesCrudPage implements OnInit {
  protected readonly i18n = es;
  private releasesService = inject(ReleasesService);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  isLoadingReleases = signal(false);
  errorMessageApi = signal<string>('');
  releases = signal<ReleasesApi[]>([]);

  ngOnInit(): void {
    this.getReleasesApi();
  }

  getReleasesApi(): void {
    this.isLoadingReleases.set(true);
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.releases.set(data.sort((a, b) => b.index - a.index) ?? []);
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
          this.isLoadingReleases.set(false);
        },
        complete: () => {
          this.isLoadingReleases.set(false);
        },
      });
  }

  navigateToDetail(id: string) {
    this.router.navigate([`/admin/releases-crud/${id}`]);
  }

  createNewRelease() {
    this.router.navigate([`/admin/releases-crud/new`]);
  }
}
