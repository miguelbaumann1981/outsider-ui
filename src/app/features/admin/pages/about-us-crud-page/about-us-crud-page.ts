import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import es from '@/i18n/es.json';

import { ViewState } from '@/features/public/types';
import { AboutUsApi, ReleasesApi } from '@/features/public/interfaces';
import { Spinner } from '@/shared/components/spinner/spinner';
import { AboutUsService, ReleasesService } from '@/features/public/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { NgxSonnerToaster } from 'ngx-sonner';

interface AboutUsCard extends AboutUsApi {
  title: string;
}

@Component({
  selector: 'out-about-us-crud-page',
  imports: [SubtitlePage, Spinner, NgClass, NgxSonnerToaster],
  templateUrl: './about-us-crud-page.html',
})
export class AboutUsCrudPage implements OnInit {
  protected readonly i18n = es;
  private releasesService = inject(ReleasesService);
  private aboutUsService = inject(AboutUsService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  isLoadingPage = signal(false);
  isLoadingReleases = signal(false);
  errorMessageApi = signal<string>('');
  aboutUsData = signal<AboutUsCard[]>([]);
  releases = signal<ReleasesApi[]>([]);

  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });
  viewState = computed<ViewState>(() => {
    if (this.isLoadingPage() || this.isLoadingReleases()) return 'loading';
    if (this.errorMessageApi()) return 'error';
    if (this.aboutUsData().length > 0) return 'available';
    return 'empty';
  });

  ngOnInit(): void {
    this.getReleasesApi();
    this.getAboutUsData();
  }

  getAboutUsData(): void {
    this.isLoadingPage.set(true);
    this.aboutUsService
      .getAboutUsInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.aboutUsData.set(
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
          this.isLoadingPage.set(false);
        },
        complete: () => {
          this.isLoadingPage.set(false);
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

  onCreateAboutUs(): void {
    this.router.navigate([`/admin/about-us-crud/new`]);
  }

  onEditLayout(id: string): void {
    this.router.navigate([`/admin/about-us-crud/${id}`]);
  }

  preview(id: string): void {
    this.router.navigate([`/admin/about-us-preview/${id}`]);
  }
}
