import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import es from '@/i18n/es.json';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService, ReleasesService } from '@/features/public/services';
import { ColorFeature, HomeLayoutApi, ReleasesApi } from '@/features/public/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HomeLayoutCrud } from '../../interfaces';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { ArticleCategory } from '@/features/public/enums';
import { homeLayoutSchemaBase } from './home-layout-crud-form-schema';
import { ReleaseCode } from '@/features/public/types';
import { CategoryTranslatePipe } from '../../pipes';

interface HomeLayoutCard extends HomeLayoutApi {
  title: string;
}

interface ReleaseCodeSelect {
  code: ReleaseCode;
  displayName: string;
}

const HOME_LAYOUT_MODEL: HomeLayoutCrud = {
  releaseCode: '',
  isDraft: false,
  isPublished: false,
  features: Array.from({ length: 6 }).map(() => ({
    category: ArticleCategory.EDITORIAL,
    position: 0,
    color: {
      solid: '',
      hover: '',
    },
  })),
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
  selector: 'out-home-layout-crud-detail',
  imports: [SubtitlePage, FormField, FormRoot, NgxSonnerToaster, CategoryTranslatePipe],
  templateUrl: './home-layout-crud-detail-page.html',
})
export class HomeLayoutCrudDetailPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private homeService = inject(HomeService);
  private releasesService = inject(ReleasesService);

  isLoading = signal(false);
  activeParam = signal<string | 'new'>('');
  homeLayouts = signal<HomeLayoutCard[]>([]);
  selectedHomeLayout = signal<HomeLayoutApi>({} as HomeLayoutApi);
  releases = signal<ReleasesApi[]>([]);

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.homeLayout.createLayout
      : this.i18n.homeLayout.editHomeLayout,
  );
  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    return this.releases().map((item) => ({
      code: item.releaseCode,
      displayName: item.name,
    }));
  });

  homeLayoutModel = signal<HomeLayoutCrud>(HOME_LAYOUT_MODEL);
  homeLayoutSchema = schema<HomeLayoutCrud>((path) => {
    apply(path, homeLayoutSchemaBase);
    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
  });
  readonly homeLayoutForm = form(this.homeLayoutModel, this.homeLayoutSchema);

  ngOnInit(): void {
    this.getHomeLayoutsApi();
    this.handleCrudHomeLayouts();
    this.getReleasesApi();
  }

  getHomeLayoutsApi(): void {
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
          toast.error(error ?? this.i18n.common.serverError);
        },
      });
  }

  handleCrudHomeLayouts(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.activeParam.set(params['id']);

      if (this.activeParam() !== 'new') {
        this.getSelectedHomeLayout(this.activeParam());
      } else {
        this.homeLayoutModel.set({
          ...HOME_LAYOUT_MODEL,
          features: this.homeLayoutModel().features.map((item, index) => ({
            ...item,
            category: ALL_CATEGORIES[index % ALL_CATEGORIES.length],
          })),
        });
      }
    });
  }

  getSelectedHomeLayout(id: string): void {
    this.homeService
      .getHomeLayoutById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.selectedHomeLayout.set(data);
          this.homeLayoutModel.set(this.selectedHomeLayout());
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

  displayColorInput(index: number, type: 'solid' | 'hover'): ColorFeature | string {
    const { features } = this.homeLayoutModel();
    const _color = features.find((item) => item.position === index + 1)?.color[type];
    return _color ?? 'white';
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const { features } = this.homeLayoutModel();
    const positions = features.map((feature) => feature.position);
    const hasValidFeaturePositions =
      positions.length === 6 &&
      new Set(positions).size === 6 &&
      positions.every((position) => position >= 1 && position <= 6);

    if (!hasValidFeaturePositions) {
      toast.error(this.i18n.homeLayout.validations.hasValidFeaturePositions);
      return;
    }

    console.log(this.homeLayoutModel());
  }

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/home-layout-crud']);
  }
}
