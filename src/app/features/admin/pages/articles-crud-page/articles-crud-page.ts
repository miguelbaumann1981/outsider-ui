import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import es from '@/i18n/es.json';
import { HomeService } from '@/features/public/services';
import { Router } from '@angular/router';
import { ReleaseCode, ViewState } from '@/features/public/types';
import { Article, ArticlesApi, ReleasesApi } from '@/features/public/interfaces';
import { Spinner } from '@/shared/components/spinner/spinner';
import { NgClass, UpperCasePipe } from '@angular/common';
import { ReleaseCodeSelect } from '../../interfaces';
import { SetInitReleaseService } from '@/core/services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, filter, lastValueFrom, Subject, takeUntil } from 'rxjs';
import { staleTime } from '@/features/public/utils';
import { HandleEditMode } from '../../services';
import { DeleteItemDialog } from '../../components/delete-item-dialog/delete-item-dialog';
import { MatDialog } from '@angular/material/dialog';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ArticlesApiWithRelease extends ArticlesApi {
  articlesExtended: ArticleWithRelease[];
}

interface ArticleWithRelease extends Article {
  isReleasePublished: boolean;
}

@Component({
  selector: 'out-articles-crud-page',
  imports: [SubtitlePage, Spinner, NgClass, UpperCasePipe, NgxSonnerToaster],
  templateUrl: './articles-crud-page.html',
})
export class ArticlesCrudPage implements OnInit, OnDestroy {
  protected readonly i18n = es;
  private homeService = inject(HomeService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private router = inject(Router);
  private handleEditMode = inject(HandleEditMode);
  private destroy$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);

  readonly releasesApi = this.setInitReleasesService.releases;
  readonly articlesApi = injectQuery(() => ({
    queryKey: ['allArticles'],
    queryFn: () => lastValueFrom(this.homeService.getAllArticles()),
    staleTime,
  }));

  optionReleaseCodeSelected = signal<ReleaseCode>('');

  releases = computed<ReleasesApi[]>(
    () => this.releasesApi.data()?.sort((a, b) => b.index - a.index) ?? [],
  );
  articlesApiWithRelease = computed<ArticlesApiWithRelease>(() => {
    const api = this.articlesApi.data() ?? ({} as ArticlesApi);
    return {
      ...api,
      articlesExtended:
        api.articles?.map((item) => ({
          ...item,
          isReleasePublished:
            this.releases().find((elem) => elem.releaseCode === item.releaseCode)?.isPublished ??
            false,
        })) ?? [],
    };
  });
  articlesFiltered = computed<ArticleWithRelease[]>(() => {
    const articles: ArticleWithRelease[] = this.articlesApiWithRelease()?.articlesExtended;

    return this.optionReleaseCodeSelected() === ''
      ? articles
      : articles.filter((item) => item.releaseCode === this.optionReleaseCodeSelected());
  });
  articlesQuantity = computed<number>(() => this.articlesFiltered()?.length ?? 0);
  viewState = computed<ViewState>(() => {
    if (this.releasesApi.isLoading() || this.articlesApi.isLoading()) return 'loading';
    if (this.releasesApi.isError() || this.releasesApi.isError()) return 'error';
    if (this.articlesFiltered()?.length > 0) return 'available';
    return 'empty';
  });
  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });
  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    return (
      this.releases().map((item) => ({
        code: item.releaseCode,
        displayName: item.name,
        disabled: false,
      })) ?? []
    );
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
        this.articlesApi.refetch();
      });
  }

  onOptionCode(code: ReleaseCode): void {
    this.optionReleaseCodeSelected.set(code);
  }

  navigateToDetailForm(id: string): void {
    this.router.navigate([`/admin/articles-crud/${id}`]);
  }

  createNewArticle(): void {
    this.router.navigate([`/admin/articles-crud/new`]);
  }

  preview(id: string): void {
    this.router.navigate([`admin/articles-preview/${id}`]);
  }

  delete(id: string): void {
    this.homeService
      .deleteArticle(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.articles.successDeleteMessageForm);
        },
        error: () => {
          toast.error(this.i18n.articles.errorDeleteMessageForm);
        },
        complete: () => {
          this.articlesApi.refetch();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
