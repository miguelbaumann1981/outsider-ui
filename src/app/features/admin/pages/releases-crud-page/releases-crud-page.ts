import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import es from '@/i18n/es.json';
import { ReleasesService } from '@/features/public/services';
import { Router } from '@angular/router';
import { ReleaseLocalStorage, ReleasesApi } from '@/features/public/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmPublishReleaseDialog } from './dialogs/confirm-publish-release-dialog/confirm-publish-release-dialog';
import { ConfirmCurrentReleaseDialog } from './dialogs/confirm-current-release-dialog/confirm-current-release-dialog';
import { ViewState } from '@/features/public/types';
import { Spinner } from '@/shared/components/spinner/spinner';
import { LocalStorageService } from '@/core/services';

@Component({
  selector: 'out-releases-crud-page',
  imports: [SubtitlePage, NgClass, NgxSonnerToaster, MatDialogModule, Spinner],
  templateUrl: './releases-crud-page.html',
})
export class ReleasesCrudPage implements OnInit {
  protected readonly i18n = es;
  private releasesService = inject(ReleasesService);
  private localStorageService = inject(LocalStorageService);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  readonly dialog = inject(MatDialog);

  isLoadingReleases = signal(false);
  errorMessageApi = signal<string>('');
  releases = signal<ReleasesApi[]>([]);
  releaseId = signal('');
  isLoading = signal(false);
  viewState = computed<ViewState>(() => {
    if (this.isLoadingReleases()) return 'loading';
    if (this.errorMessageApi()) return 'error';
    if (this.releases().length > 0) return 'available';
    return 'empty';
  });

  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });

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

  publish(release: ReleasesApi, isPublished: boolean): void {
    this.isLoading.set(true);
    this.releaseId.set(release.id);
    let formData = release;
    formData['isDraft'] = isPublished;
    formData['isPublished'] = !isPublished;

    this.releasesService
      .updateRelease(this.releaseId(), formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(
            isPublished
              ? this.i18n.releases.successUnpublishMessageForm
              : this.i18n.releases.successPublishMessageForm,
          );
        },
        error: () => {
          toast.error(
            isPublished
              ? this.i18n.releases.errorUnpublishMessageForm
              : this.i18n.releases.errorPublishMessageForm,
          );
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  setAsCurrent(release: ReleasesApi): void {
    this.isLoading.set(true);

    const oldCurrent = { ...this.currentRelease(), isCurrentRelease: false };
    const newCurrent = { ...release, isCurrentRelease: true };
    console.log([oldCurrent, newCurrent]);

    this.releasesService
      .updateBulk([oldCurrent, newCurrent])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.releases.successSetAsCurrentMessageForm);
        },
        error: () => {
          toast.error(this.i18n.releases.errorSetAsCurrentMessageForm);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
          this.getReleasesApi();

          const release: ReleaseLocalStorage = {
            code: newCurrent.releaseCode,
            isCurrent: true,
          };
          this.localStorageService.setItem('release', JSON.stringify(release));
        },
      });
  }

  openConfirmPublishDialog(release: ReleasesApi, isPublished: boolean): void {
    const dialogRef = this.dialog.open(ConfirmPublishReleaseDialog, {
      data: {
        isPublished,
      },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.publish(release, isPublished);
      }
    });
  }

  openConfirmChangeCurrentDialog(release: ReleasesApi): void {
    const dialogRef = this.dialog.open(ConfirmCurrentReleaseDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.setAsCurrent(release);
      }
    });
  }
}
