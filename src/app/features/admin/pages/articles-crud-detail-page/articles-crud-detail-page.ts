import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ArticleCrud, ReleaseCodeSelect } from '../../interfaces';
import { ArticleCategory } from '@/features/public/enums';
import { InputTextRichForm } from '@/shared/components/input-text-rich-form/input-text-rich-form';
import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ActivatedRoute, Router } from '@angular/router';
import { AboutUsService, ReleasesService } from '@/features/public/services';
import es from '@/i18n/es.json';
import { Article, ArticlesApi, ReleasesApi } from '@/features/public/interfaces';
import { ReleaseCode } from '@/features/public/types';
import { articleSchemaBase } from './article-crud-form-schema';

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
  subtitle: '',
  references: '',
  authorQuote: '',
  authorInfo: '',
  quote: '',
};

@Component({
  selector: 'out-articles-crud-detail-page',
  imports: [SubtitlePage, FormField, FormRoot, NgxSonnerToaster, InputTextRichForm],
  templateUrl: './articles-crud-detail-page.html',
})
export class ArticlesCrudDetailPage {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private aboutUsService = inject(AboutUsService);
  private releasesService = inject(ReleasesService);

  isLoading = signal(false);
  activeParam = signal<string | 'new'>('');
  articlesData = signal<Article[]>([]);
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  selectedArticle = signal<Article>({} as Article);
  releases = signal<ReleasesApi[]>([]);
  errorMessageApi = signal<string>('');
  optionReleaseCodeSelected = signal<ReleaseCode>('');

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.aboutUs.createNewAboutUsInfo
      : this.i18n.aboutUs.editAboutUsInfo,
  );
  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });
  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    return this.releases().map((item) => ({
      code: item.releaseCode,
      displayName: item.name,
      disabled: false,
    }));
  });

  articleModel = signal<ArticleCrud>(ARTICLE_MODEL);
  articleSchema = schema<ArticleCrud>((path) => {
    apply(path, articleSchemaBase);
    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
  });
  readonly articleForm = form(this.articleModel, this.articleSchema);

  onOptionCode(code: ReleaseCode): void {
    this.optionReleaseCodeSelected.set(code);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/article-crud']);
  }
}
