import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, inject, OnInit } from '@angular/core';
import es from '@/i18n/es.json';
import { ViewState } from '@/features/public/types';
import { AboutUsApi, ReleasesApi } from '@/features/public/interfaces';
import { Spinner } from '@/shared/components/spinner/spinner';
import { AboutUsService } from '@/features/public/services';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { NgxSonnerToaster } from 'ngx-sonner';
import { SetInitReleaseService } from '@/core/services';
import { HandleEditMode } from '../../services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { staleTime } from '@/features/public/utils';

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
  private aboutUsService = inject(AboutUsService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private router = inject(Router);
  private handleEditMode = inject(HandleEditMode);

  readonly releasesApi = this.setInitReleasesService.releases;
  readonly aboutUsApi = injectQuery(() => ({
    queryKey: ['infoAboutUsApi'],
    queryFn: () => lastValueFrom(this.aboutUsService.getAboutUsInfo()),
    staleTime,
  }));

  releases = computed<ReleasesApi[]>(
    () => this.releasesApi.data()?.sort((a, b) => b.index - a.index) ?? [],
  );
  aboutUsData = computed<AboutUsCard[]>(() => {
    const api = this.aboutUsApi.data();
    return (
      api?.map((item) => ({
        ...item,
        title:
          this.releasesApi.data()?.find((release) => release.releaseCode === item.releaseCode)
            ?.name ?? '',
      })) ?? []
    );
  });
  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });
  viewState = computed<ViewState>(() => {
    if (this.releasesApi.isLoading() || this.aboutUsApi.isLoading()) return 'loading';
    if (this.releasesApi.isError() || this.aboutUsApi.isError()) return 'error';
    if (this.aboutUsData().length > 0) return 'available';
    return 'empty';
  });

  ngOnInit(): void {
    this.handleEditMode.getEditMode().subscribe((isEdited: boolean) => {
      if (isEdited) {
        this.aboutUsApi.refetch();
      }
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
