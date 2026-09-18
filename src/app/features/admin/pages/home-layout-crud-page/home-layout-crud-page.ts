import { Spinner } from '@/shared/components/spinner/spinner';
import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import es from '@/i18n/es.json';
import { ViewState } from '@/features/public/types';
import { HomeLayoutApi, ReleasesApi } from '@/features/public/interfaces';
import { HomeService, ReleasesService } from '@/features/public/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface HomeLayoutCard extends HomeLayoutApi {
  title: string;
}

@Component({
  selector: 'out-home-layout-crud',
  imports: [SubtitlePage, NgClass, NgxSonnerToaster, MatDialogModule, Spinner],
  templateUrl: './home-layout-crud-page.html',
})
export class HomeLayoutCrudPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  readonly dialog = inject(MatDialog);
  private homeService = inject(HomeService);
  private releasesService = inject(ReleasesService);

  isLoadingHomeLayouts = signal(false);
  isLoadingReleases = signal(false);
  errorMessageApi = signal<string>('');
  homeLayouts = signal<HomeLayoutCard[]>([]);
  releases = signal<ReleasesApi[]>([]);

  viewState = computed<ViewState>(() => {
    if (this.isLoadingHomeLayouts() || this.isLoadingReleases()) return 'loading';
    if (this.errorMessageApi()) return 'error';
    if (this.homeLayouts().length > 0) return 'available';
    return 'empty';
  });

  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });

  ngOnInit(): void {
    this.getReleasesApi();
    this.getHomeLayoutsApi();
  }

  getHomeLayoutsApi(): void {
    this.isLoadingHomeLayouts.set(true);
    this.homeService
      .getHomeLayout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.homeLayouts.set(
            data.map((item) => {
              const title =
                this.releases().find((release) => release.releaseCode === item.releaseCode)?.name ??
                '';
              return { ...item, title };
            }),
          );
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
          this.isLoadingHomeLayouts.set(false);
        },
        complete: () => {
          this.isLoadingHomeLayouts.set(false);
        },
      });
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

  onCreateNewLayout(): void {
    this.router.navigate(['/admin/home-layout-crud/new']);
  }

  onEditLayout(id: string): void {
    this.router.navigate([`/admin/home-layout-crud/${id}`]);
  }
}
