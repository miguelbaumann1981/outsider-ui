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
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerDialog } from '../../components/color-picker-dialog/color-picker-dialog';

interface HomeLayoutCard extends HomeLayoutApi {
  title: string;
}

interface ReleaseCodeSelect {
  code: ReleaseCode;
  displayName: string;
  disabled: boolean;
}

const HOME_LAYOUT_MODEL: HomeLayoutCrud = {
  releaseCode: '',
  isDraft: true,
  isPublished: true,
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
  readonly dialog = inject(MatDialog);

  isLoading = signal(false);
  activeParam = signal<string | 'new'>('');
  homeLayouts = signal<HomeLayoutCard[]>([]);
  selectedHomeLayout = signal<HomeLayoutApi>({} as HomeLayoutApi);
  releases = signal<ReleasesApi[]>([]);
  optionReleaseCodeSelected = signal<ReleaseCode>('');

  currentReleaseCode = computed<ReleaseCode>(() => {
    return this.releases().find((item) => item.isCurrentRelease)?.releaseCode ?? '';
  });
  activeLayouts = computed<ReleaseCode[]>(() => this.homeLayouts().map((elem) => elem.releaseCode));

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.homeLayout.createLayout
      : this.i18n.homeLayout.editHomeLayout,
  );
  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    return this.releases().map((item) => ({
      code: item.releaseCode,
      displayName: item.name,
      disabled: this.activeLayouts()?.includes(item.releaseCode),
    }));
  });
  releasesCodeCloneOptions = computed<ReleaseCodeSelect[]>(() => {
    return this.releases().map((item) => ({
      code: item.releaseCode,
      displayName: item.name,
      disabled: !this.activeLayouts()?.includes(item.releaseCode),
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

      if (this.activeParam() === 'new') {
        this.homeLayoutModel.set({
          ...HOME_LAYOUT_MODEL,
          features: this.homeLayoutModel().features.map((item, index) => ({
            ...item,
            category: ALL_CATEGORIES[index % ALL_CATEGORIES.length],
          })),
        });
      } else {
        this.getSelectedHomeLayout(this.activeParam());
      }
    });
  }

  getSelectedHomeLayout(id: string): void {
    this.homeService
      .getHomeLayoutById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          data.features.sort((a, b) => a.position - b.position);
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

  getClonedHomeLayout(id: string): void {
    this.homeService
      .getHomeLayoutById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.homeLayoutModel.set({
            ...data,
            releaseCode: this.optionReleaseCodeSelected(),
          });
          console.log(this.homeLayoutModel());
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
    const applyColor = features.find((item) => item.position === index + 1)?.color[type];
    return applyColor ?? 'white';
  }

  openColorPickerDialog(index: number, type: 'solid' | 'hover'): void {
    const dialogRef = this.dialog.open(ColorPickerDialog, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const updatedFeatures = this.homeLayoutModel().features.map((item, featureIndex) =>
          featureIndex === index
            ? {
                ...item,
                color:
                  type === 'solid'
                    ? {
                        ...item.color,
                        solid: result,
                      }
                    : {
                        ...item.color,
                        hover: result,
                      },
              }
            : item,
        );

        this.homeLayoutModel.set({
          ...this.homeLayoutModel(),
          features: updatedFeatures,
        });
      }
    });
  }

  onOptionCode(code: ReleaseCode): void {
    console.log(code);
    this.optionReleaseCodeSelected.set(code);
  }

  onCloneSelect(code: ReleaseCode): void {
    console.log(code);
    const layoutId = this.homeLayouts().find((item) => item.releaseCode === code)?.id ?? 'new';

    this.getClonedHomeLayout(layoutId);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading.set(true);
    const { features } = this.homeLayoutModel();
    const positions = features.map((feature) => feature.position);
    const hasValidFeaturePositions =
      positions.length === 6 &&
      new Set(positions).size === 6 &&
      positions.every((position) => position >= 1 && position <= 6);

    if (!hasValidFeaturePositions) {
      toast.error(this.i18n.homeLayout.validations.hasValidFeaturePositions);
      this.isLoading.set(false);
      return;
    }

    const formData = this.homeLayoutModel();

    if (this.activeParam() === 'new') {
      this.createLayout(formData);
    } else {
      this.updateLayout(this.selectedHomeLayout().id, formData);
    }
  }

  createLayout(formData: HomeLayoutCrud): void {
    this.homeService
      .createHomeLayout(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.homeLayout.successEditMessageForm);
        },
        error: () => {
          toast.error(this.i18n.homeLayout.errorEditMessageForm);
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

  updateLayout(id: string, formData: HomeLayoutCrud): void {
    this.homeService
      .updateHomeLayout(id, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.homeLayout.successEditMessageForm);
        },
        error: () => {
          toast.error(this.i18n.homeLayout.errorEditMessageForm);
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

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/home-layout-crud']);
  }
}
