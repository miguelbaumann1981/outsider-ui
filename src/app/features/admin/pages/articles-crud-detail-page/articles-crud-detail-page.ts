import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { ArticleCrud, ReleaseCodeSelect } from '../../interfaces';
import { ArticleCategory } from '@/features/public/enums';
import { InputTextRichForm } from '@/shared/components/input-text-rich-form/input-text-rich-form';
import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '@/features/public/services';
import es from '@/i18n/es.json';
import { ReleasesApi } from '@/features/public/interfaces';
import { ReleaseCode } from '@/features/public/types';
import { articleSchemaBase } from './article-crud-form-schema';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UpperCasePipe } from '@angular/common';
import { ImgFallbackDirective } from '@/features/public/directives';
import { SetInitReleaseService } from '@/core/services';
import { HandleEditMode } from '../../services';
import { lastValueFrom, map } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { staleTime } from '@/features/public/utils';

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
export class ArticlesCrudDetailPage {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private homeService = inject(HomeService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private handleEditMode = inject(HandleEditMode);

  isLoading = signal(false);
  optionReleaseCodeSelected = signal<ReleaseCode>('');
  optionCategorySelected = signal<ArticleCategory | undefined>(undefined);
  categoriesOptions = signal<ReleaseCodeSelect[]>([]);
  emptyImage = signal<string>(EMPTY_IMAGE);

  activeParam = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])), {
    initialValue: '',
  });
  readonly releasesApi = this.setInitReleasesService.releases;
  readonly articlesApi = injectQuery(() => ({
    queryKey: ['allArticles'],
    queryFn: () => lastValueFrom(this.homeService.getAllArticles()),
    staleTime,
  }));
  readonly selectedArticle = injectQuery(() => ({
    queryKey: ['release', this.activeParam()],
    queryFn: () => lastValueFrom(this.homeService.getArticleById(this.activeParam())),
    enabled: this.activeParam() !== '' && this.activeParam() !== 'new',
    staleTime,
  }));

  imageDisplayed = computed<string>(() => {
    return this.articleForm.image().value() ?? this.emptyImage();
  });

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.aboutUs.createNewAboutUsInfo
      : this.i18n.aboutUs.editAboutUsInfo,
  );
  currentReleaseCode = computed<ReleaseCode>(() => {
    return this.releasesApi.data()?.find((item) => item.isCurrentRelease)?.releaseCode ?? '';
  });
  currentRelease = computed<ReleasesApi>(() => {
    return this.releasesApi.data()?.find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });

  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    const filtered: ReleasesApi[] =
      this.releasesApi.data()?.filter((item) => !item.isPublished) ?? [];
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

  private syncArticleModel = effect(() => {
    if (this.activeParam() === 'new') {
      this.articleModel.set(ARTICLE_MODEL);
    } else {
      const dataApi = this.selectedArticle.data();
      const dataModel = {
        content: dataApi?.content ?? ARTICLE_MODEL.content,
        image: dataApi?.image ?? ARTICLE_MODEL.image,
        releaseCode: (dataApi?.releaseCode as ReleaseCode | undefined) ?? ARTICLE_MODEL.releaseCode,
        slug: dataApi?.slug ?? ARTICLE_MODEL.slug,
        titleArticle: dataApi?.titleArticle ?? ARTICLE_MODEL.titleArticle,
        titleCategory: dataApi?.titleCategory ?? ARTICLE_MODEL.titleCategory,
        category: dataApi?.category ?? ARTICLE_MODEL.category,
        authorArticle: dataApi?.authorArticle ?? ARTICLE_MODEL.authorArticle,
        isDraft: dataApi?.isDraft ?? ARTICLE_MODEL.isDraft,
        isPublished: dataApi?.isPublished ?? ARTICLE_MODEL.isPublished,
        subtitle: dataApi?.subtitle ?? ARTICLE_MODEL.subtitle,
        references: dataApi?.references ?? ARTICLE_MODEL.references,
        authorQuote: dataApi?.authorQuote ?? ARTICLE_MODEL.authorQuote,
        authorInfo: dataApi?.authorInfo ?? ARTICLE_MODEL.authorInfo,
        quote: dataApi?.quote ?? ARTICLE_MODEL.quote,
      };

      this.articleModel.set(dataModel);
    }
  });

  readonly articleForm = form(this.articleModel, this.articleSchema);

  onOptionCode(code: ReleaseCode): void {
    this.optionReleaseCodeSelected.set(code);

    const usedCategories =
      this.articlesApi
        .data()
        ?.articles.filter((item) => item.releaseCode === code)
        .map((item) => item.category) ?? [];

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
            this.navigateToPreviousPage(true);
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
            this.navigateToPreviousPage(true);
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
      this.releasesApi.data()?.find((item) => item.releaseCode === formData.releaseCode)
        ?.isPublished ?? false;

    if (this.activeParam() === 'new') {
      this.createArticleData(formData);
    } else {
      this.updateArticleData(this.selectedArticle.data()?.id ?? '', formData);
    }
  }

  navigateToPreviousPage(isEdited?: boolean): void {
    this.router.navigate(['/admin/articles-crud']);
    this.handleEditMode.setEditMode(isEdited ?? false);
  }
}
