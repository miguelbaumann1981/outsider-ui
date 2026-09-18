import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ArticleCrud, ReleaseCodeSelect } from '../../interfaces';
import { ArticleCategory } from '@/features/public/enums';
import { InputTextRichForm } from '@/shared/components/input-text-rich-form/input-text-rich-form';
import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { ActivatedRoute, Router } from '@angular/router';
import { AboutUsService, HomeService, ReleasesService } from '@/features/public/services';
import es from '@/i18n/es.json';
import { Article, ArticlesApi, ReleasesApi } from '@/features/public/interfaces';
import { ReleaseCode } from '@/features/public/types';
import { articleSchemaBase } from './article-crud-form-schema';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpperCasePipe } from '@angular/common';

const ARTICLE_MODEL: ArticleCrud = {
  authorArticle: '',
  category: ArticleCategory.EDITORIAL,
  content: '',
  image: '',
  releaseCode: '',
  slug: '',
  titleArticle: '',
  titleCategory: '',
  isDraft: false,
  isPublished: false,
  subtitle: 'Sobre el autor/a',
  references: '',
  authorQuote: '',
  authorInfo: '',
  quote: '',
};

const ALL_CATEGORIES: ArticleCategory[] = [
  ArticleCategory.EDITORIAL,
  ArticleCategory.MICROSTORY,
  ArticleCategory.OPINION,
  ArticleCategory.OUTSIDERS,
  ArticleCategory.POETRY,
  ArticleCategory.TALES,
];

@Component({
  selector: 'out-articles-crud-detail-page',
  imports: [SubtitlePage, FormField, FormRoot, NgxSonnerToaster, InputTextRichForm, UpperCasePipe],
  templateUrl: './articles-crud-detail-page.html',
})
export class ArticlesCrudDetailPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private releasesService = inject(ReleasesService);
  private homeService = inject(HomeService);

  isLoading = signal(false);
  activeParam = signal<string | 'new'>('');
  articlesData = signal<Article[]>([]);
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  selectedArticle = signal<Article>({} as Article);
  releases = signal<ReleasesApi[]>([]);
  errorMessageApi = signal<string>('');
  optionReleaseCodeSelected = signal<ReleaseCode>('');
  optionCategorySelected = signal<ArticleCategory | undefined>(undefined);

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.aboutUs.createNewAboutUsInfo
      : this.i18n.aboutUs.editAboutUsInfo,
  );
  currentReleaseCode = computed<ReleaseCode>(() => {
    return this.releases().find((item) => item.isCurrentRelease)?.releaseCode ?? '';
  });
  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });

  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    const filtered: ReleasesApi[] = this.releases().filter((item) => !item.isPublished);
    return filtered.map((release) => ({
      code: release.releaseCode,
      displayName: release.name,
      disabled: false,
    }));
  });

  categoriesOptions = computed<ReleaseCodeSelect[]>(() => {
    return ALL_CATEGORIES.map((item) => ({
      category: item,
      displayName: item,
      disabled: false,
    }));
  });

  articleModel = signal<ArticleCrud>(ARTICLE_MODEL);
  articleSchema = schema<ArticleCrud>((path) => {
    apply(path, articleSchemaBase);
    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
  });
  readonly articleForm = form(this.articleModel, this.articleSchema);

  ngOnInit(): void {
    this.handleCrudArticles();
    this.getReleasesApi();
  }

  handleCrudArticles(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.activeParam.set(params['id']);

      if (this.activeParam() === 'new') {
        this.articleModel.set(ARTICLE_MODEL);
      } else {
        this.getSelectedArticleData(this.activeParam());
      }
    });
  }

  getSelectedArticleData(id: string): void {
    this.homeService
      .getArticleById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.selectedArticle.set({
            ...data,
            subtitle: data.subtitle ?? undefined,
            references: data.references ?? undefined,
            authorQuote: data.authorQuote ?? undefined,
            authorInfo: data.authorInfo ?? undefined,
            quote: data.quote ?? undefined,
          });
          this.articleModel.set(this.selectedArticle());
        },
        error: () => {
          toast.error(this.i18n.common.serverError);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  getReleasesApi(): void {
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.releases.set(data);
        },
        error: (error) => {
          toast.error(error ?? this.i18n.common.serverError);
        },
        complete: () => {},
      });
  }

  onOptionCode(code: ReleaseCode): void {
    this.optionReleaseCodeSelected.set(code);
  }

  onOptionCategory(category: ArticleCategory | undefined): void {
    this.optionCategorySelected.set(category);

    switch (this.optionCategorySelected()) {
      case ArticleCategory.EDITORIAL:
        return this.articleModel.set({
          ...ARTICLE_MODEL,
          quote: undefined,
          authorQuote: undefined,
          authorInfo: undefined,
          subtitle: undefined,
        });
      case ArticleCategory.MICROSTORY:
        return this.articleModel.set({
          ...ARTICLE_MODEL,
          quote: undefined,
          authorQuote: undefined,
        });
      case ArticleCategory.OPINION:
        return this.articleModel.set({
          ...ARTICLE_MODEL,
          quote: undefined,
          authorQuote: undefined,
        });
      case ArticleCategory.OUTSIDERS:
        return this.articleModel.set({
          ...ARTICLE_MODEL,
          quote: undefined,
          authorQuote: undefined,
          authorInfo: undefined,
          subtitle: undefined,
        });
      case ArticleCategory.POETRY:
        return this.articleModel.set(ARTICLE_MODEL);
      case ArticleCategory.TALES:
        return this.articleModel.set({
          ...ARTICLE_MODEL,
          quote: undefined,
          authorQuote: undefined,
          authorInfo: undefined,
          subtitle: undefined,
        });

      default:
        return this.articleModel.set(ARTICLE_MODEL);
    }
  }

  createAboutUsInfoData(formData: ArticleCrud): void {
    this.homeService
      .createArticle(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.articles.successEditMessageForm);
        },
        error: () => {
          toast.error(this.i18n.articles.errorEditMessageForm);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
          setTimeout(() => {
            this.navigateToPreviousPage();
          }, 1500);
        },
      });
  }

  updateAboutUsInfoData(id: string, formData: ArticleCrud): void {
    this.homeService
      .updateArticle(id, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.articles.successEditMessageForm);
        },
        error: () => {
          toast.error(this.i18n.articles.errorEditMessageForm);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
          setTimeout(() => {
            this.navigateToPreviousPage();
          }, 1500);
        },
      });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading.set(true);

    const formData = this.articleModel();

    if (this.activeParam() === 'new') {
      this.createAboutUsInfoData(formData);
    } else {
      this.updateAboutUsInfoData(this.selectedArticle().id, formData);
    }
  }

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/articles-crud']);
  }
}
