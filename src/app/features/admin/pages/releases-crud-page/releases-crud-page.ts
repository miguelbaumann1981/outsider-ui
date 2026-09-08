import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import es from '@/i18n/es.json';
import { ReleasesService } from '@/features/public/services';
import { Router } from '@angular/router';
import { ReleasesApi } from '@/features/public/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { delay } from 'rxjs';

@Component({
  selector: 'out-releases-crud-page',
  imports: [SubtitlePage, NgClass, NgxSonnerToaster],
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
  releaseId = signal('');
  isLoading = signal(false);

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

  navigateToDetailForm(id: string): void {
    this.router.navigate([`/admin/releases-crud/${id}`]);
  }

  createNewRelease(): void {
    this.router.navigate([`/admin/releases-crud/new`]);
  }

  publish(release: ReleasesApi): void {
    this.isLoading.set(true);
    this.releaseId.set(release.id);
    let formData = release;
    formData['isDraft'] = false;
    formData['isPublished'] = true;

    this.releasesService
      .updateRelease(this.releaseId(), formData)
      .pipe(takeUntilDestroyed(this.destroyRef), delay(1500))
      .subscribe({
        next: () => {
          toast.success(this.i18n.releases.successPublishMessageForm);
        },
        error: () => {
          toast.error(this.i18n.releases.errorPublishMessageForm);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  onToggleChange(id: string): void {}
}
