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
import { HandleEditMode } from '../../services';
import { SetInitReleaseService } from '@/core/services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { staleTime } from '@/features/public/utils';

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
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private homeService = inject(HomeService);
  private handleEditMode = inject(HandleEditMode);
  private setInitReleasesService = inject(SetInitReleaseService);

  readonly releasesApi = this.setInitReleasesService.releases;
  readonly homeLayoutApi = injectQuery(() => ({
    queryKey: ['homeLayout'],
    queryFn: () => lastValueFrom(this.homeService.getHomeLayout()),
    staleTime,
  }));

  homeLayout = computed<HomeLayoutCard[]>(() => {
    const data = this.homeLayoutApi.data() ?? [];
    return data?.map((item) => ({
      ...item,
      title:
        this.releasesApi.data()?.find((release) => release.releaseCode === item.releaseCode)
          ?.name ?? '',
    }));
  });
  releases = computed<ReleasesApi[]>(
    () => this.releasesApi.data()?.sort((a, b) => b.index - a.index) ?? [],
  );

  viewState = computed<ViewState>(() => {
    if (this.releasesApi.isLoading() || this.homeLayoutApi.isLoading()) return 'loading';
    if (this.releasesApi.isError() || this.homeLayoutApi.isError()) return 'error';
    if (this.homeLayout().length > 0) return 'available';
    return 'empty';
  });

  currentRelease = computed<ReleasesApi>(() => {
    return this.releasesApi.data()?.find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });

  ngOnInit(): void {
    this.handleEditMode.getEditMode().subscribe((isEdited: boolean) => {
      if (isEdited) {
        this.homeLayoutApi.refetch();
      }
    });
  }

  onCreateNewLayout(): void {
    this.router.navigate(['/admin/home-layout-crud/new']);
  }

  onEditLayout(id: string): void {
    this.router.navigate([`/admin/home-layout-crud/${id}`]);
  }
}
