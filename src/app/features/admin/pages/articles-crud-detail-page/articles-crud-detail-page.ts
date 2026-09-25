import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ArticleCrud, ReleaseCodeSelect } from '../../interfaces';
import { ArticleCategory } from '@/features/public/enums';
import { InputTextRichForm } from '@/shared/components/input-text-rich-form/input-text-rich-form';
import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService, ReleasesService } from '@/features/public/services';
import es from '@/i18n/es.json';
import { Article, ArticlesApi, ReleasesApi } from '@/features/public/interfaces';
import { ReleaseCode } from '@/features/public/types';
import { articleSchemaBase } from './article-crud-form-schema';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpperCasePipe } from '@angular/common';
import { ImgFallbackDirective } from '@/features/public/directives';

const ARTICLE_MODEL: ArticleCrud = {
  authorArticle: '',
  category: ArticleCategory.EDITORIAL,
  content: '',
  image: 'https://outsider-api-node-production.up.railway.app/api/images/',
  releaseCode: '',
  slug: '',
  titleArticle: '',
  titleCategory: '',
  isDraft: true,
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

const EMPTY_IMAGE: string = '/assets/empty-picture.png';

@Component({
  selector: 'out-articles-crud-detail-page',
  imports: [
    SubtitlePage,
    FormField,
    FormRoot,
    NgxSonnerToaster,
    InputTextRichForm,
    UpperCasePipe,
    ImgFallbackDirective,
  ],
  templateUrl: './articles-crud-detail-page.html',
})
export class ArticlesCrudDetailPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private releasesService = inject(ReleasesService);
  private homeService = inject(HomeService);

  isLoading = signal(false);
  isLoadingArticles = signal(false);
  activeParam = signal<string | 'new'>('');
  articlesData = signal<Article[]>([]);
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  selectedArticle = signal<Article>({} as Article);
  releases = signal<ReleasesApi[]>([]);
  errorMessageApi = signal<string>('');
  optionReleaseCodeSelected = signal<ReleaseCode>('');
  optionCategorySelected = signal<ArticleCategory | undefined>(undefined);
  categoriesOptions = signal<ReleaseCodeSelect[]>([]);
  emptyImage = signal<string>(EMPTY_IMAGE);
  imageDisplayed = computed<string>(() => {
    return this.articleForm.image().value() ?? this.emptyImage();
  });

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

  articleModel = signal<ArticleCrud>(ARTICLE_MODEL);
  articleSchema = schema<ArticleCrud>((path) => {
    apply(path, articleSchemaBase);
    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
    disabled(path.category, { when: () => this.optionReleaseCodeSelected() === '' });
  });
  readonly articleForm = form(this.articleModel, this.articleSchema);

  ngOnInit(): void {
    this.handleCrudArticles();
    this.getReleasesApi();
    this.getArticlesApi();
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

  getArticlesApi(): void {
    this.isLoadingArticles.set(true);
    this.homeService
      .getAllArticles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (articlesData) => {
          this.articlesApi.set(articlesData);
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
          this.isLoadingArticles.set(false);
        },
        complete: () => {
          this.isLoadingArticles.set(false);
        },
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
            subtitle: data.subtitle ?? '',
            references: data.references ?? '',
            authorQuote: data.authorQuote ?? '',
            authorInfo: data.authorInfo ?? '',
            quote: data.quote ?? '',
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

    const usedCategories = this.articlesApi()
      .articles.filter((item) => item.releaseCode === code)
      .map((item) => item.category);

    const availableCategories = ALL_CATEGORIES.filter(
      (category) => !usedCategories.includes(category),
    );

    this.categoriesOptions.set(
      availableCategories.map((category) => ({
        category,
        displayName: category,
        disabled: false,
      })),
    );
  }

  onOptionCategory(category: ArticleCategory | undefined): void {
    this.optionCategorySelected.set(category);

    this.articleModel.set({
      ...ARTICLE_MODEL,
      releaseCode: this.optionReleaseCodeSelected(),
    });
  }

  createArticleData(formData: ArticleCrud): void {
    this.homeService
      .createArticle(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.articles.successCreateMessageForm);
        },
        error: () => {
          toast.error(this.i18n.articles.errorCreateMessageForm);
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

  updateArticleData(id: string, formData: ArticleCrud): void {
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
    formData.category = this.optionCategorySelected() ?? formData.category;
    formData.slug = formData.slug.toLowerCase();
    formData.isPublished =
      this.releases().find((item) => item.releaseCode === formData.releaseCode)?.isPublished ??
      false;

    if (this.activeParam() === 'new') {
      this.createArticleData(formData);
    } else {
      this.updateArticleData(this.selectedArticle().id, formData);
    }
  }

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/articles-crud']);
  }
}
