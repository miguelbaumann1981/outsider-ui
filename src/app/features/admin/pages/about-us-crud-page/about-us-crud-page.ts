import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import es from '@/i18n/es.json';
import { ReleaseCode, ViewState } from '@/features/public/types';
import { AboutUsApi, ReleasesApi } from '@/features/public/interfaces';
import { Spinner } from '@/shared/components/spinner/spinner';
import { AboutUsService } from '@/features/public/services';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { SetInitReleaseService } from '@/core/services';
import { HandleEditMode } from '../../services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, filter, lastValueFrom, Subject, takeUntil } from 'rxjs';
import { staleTime } from '@/features/public/utils';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialog } from '../../components/delete-item-dialog/delete-item-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface AboutUsCard extends AboutUsApi {
  title: string;
}

@Component({
  selector: 'out-about-us-crud-page',
  imports: [SubtitlePage, Spinner, NgClass, NgxSonnerToaster],
  templateUrl: './about-us-crud-page.html',
})
export class AboutUsCrudPage implements OnInit, OnDestroy {
  protected readonly i18n = es;
  private aboutUsService = inject(AboutUsService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private router = inject(Router);
  private handleEditMode = inject(HandleEditMode);
  private destroy$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);

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
    this.handleEditMode
      .getEditMode()
      .pipe(
        distinctUntilChanged(),
        filter((isEdited) => isEdited === true),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.aboutUsApi.refetch();
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

  delete(id: string): void {
    this.aboutUsService
      .deleteAboutUsInfo(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.aboutUs.successDeleteMessageForm);
        },
        error: () => {
          toast.error(this.i18n.aboutUs.errorDeleteMessageForm);
        },
        complete: () => {
          this.aboutUsApi.refetch();
        },
      });
  }

  openDeleteItemDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteItemDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(id);
      }
    });
  }

  isReleasePublished(code: ReleaseCode): boolean {
    return this.releasesApi.data()?.find((elem) => elem.releaseCode === code)?.isPublished ?? false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
