import { AboutUsService, ReleasesService } from '@/features/public/services';
import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import es from '@/i18n/es.json';
import { AboutUsApi, ReleasesApi } from '@/features/public/interfaces';
import { AboutUsCrud, ReleaseCodeSelect } from '../../interfaces';
import { ArticleCategory } from '@/features/public/enums';
import { ReleaseCode } from '@/features/public/types';
import { aboutUsSchemaBase } from './about-us-crud-form-schema';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextRichForm } from '@/shared/components/input-text-rich-form/input-text-rich-form';

interface AboutUsCard extends AboutUsApi {
  title: string;
}

const ABOUT_US_MODEL: AboutUsCrud = {
  releaseCode: '',
  isDraft: true,
  isPublished: true,
  mainText: '',
  collaborators: Array.from({ length: 3 }).map(() => ({
    name: '',
    text: '',
    picture: '',
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
  selector: 'out-about-us-crud-detail-page',
  imports: [SubtitlePage, FormField, FormRoot, NgxSonnerToaster, InputTextRichForm],
  templateUrl: './about-us-crud-detail-page.html',
})
export class AboutUsCrudDetailPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private aboutUsService = inject(AboutUsService);
  private releasesService = inject(ReleasesService);

  isLoading = signal(false);
  activeParam = signal<string | 'new'>('');
  aboutUsData = signal<AboutUsCard[]>([]);
  selectedAboutUsData = signal<AboutUsApi>({} as AboutUsApi);
  releases = signal<ReleasesApi[]>([]);
  errorMessageApi = signal<string>('');
  optionReleaseCodeSelected = signal<ReleaseCode>('');

  activeLayouts = computed<ReleaseCode[]>(() => this.aboutUsData().map((elem) => elem.releaseCode));

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.aboutUs.createNewAboutUsInfo
      : this.i18n.aboutUs.editAboutUsInfo,
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

  aboutUsModel = signal<AboutUsCrud>(ABOUT_US_MODEL);
  aboutUsSchema = schema<AboutUsCrud>((path) => {
    apply(path, aboutUsSchemaBase);

    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
  });
  readonly aboutUsForm = form(this.aboutUsModel, this.aboutUsSchema);

  ngOnInit(): void {
    this.getAboutUsData();
    this.handleCrudHomeLayouts();
    this.getReleasesApi();
  }

  getAboutUsData(): void {
    this.aboutUsService
      .getAboutUsInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.aboutUsData.set(
            data.map((item) => {
              const title =
                this.releases().find((release) => release.releaseCode === item.releaseCode)?.name ??
                '';
              return { ...item, title };
            }),
          );
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
        },
        complete: () => {},
      });
  }

  handleCrudHomeLayouts(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.activeParam.set(params['id']);

      if (this.activeParam() === 'new') {
        this.aboutUsModel.set(ABOUT_US_MODEL);
      } else {
        this.getSelectedAboutUsInfo(this.activeParam());
      }
    });
  }

  getSelectedAboutUsInfo(id: string): void {
    this.aboutUsService
      .getAboutUsInfoById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.selectedAboutUsData.set(data);
          this.aboutUsModel.set(this.selectedAboutUsData());
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
    this.aboutUsService
      .getAboutUsInfoById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.aboutUsModel.set({
            ...data,
            releaseCode: this.optionReleaseCodeSelected(),
          });
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

  onCloneSelect(code: ReleaseCode): void {
    const aboutUsId = this.aboutUsData().find((item) => item.releaseCode === code)?.id ?? 'new';
    this.getClonedHomeLayout(aboutUsId);
  }

  displayPicture(picture: string): string {
    return picture;
  }

  createAboutUsInfoData(formData: AboutUsCrud): void {
    this.aboutUsService
      .createAboutUsInfo(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.aboutUs.successEditMessageForm);
        },
        error: () => {
          toast.error(this.i18n.aboutUs.errorEditMessageForm);
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

  updateAboutUsInfoData(id: string, formData: AboutUsCrud): void {
    this.aboutUsService
      .updateAboutUsInfo(id, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.aboutUs.successEditMessageForm);
        },
        error: () => {
          toast.error(this.i18n.aboutUs.errorEditMessageForm);
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

    const formData = this.aboutUsModel();

    if (this.activeParam() === 'new') {
      this.createAboutUsInfoData(formData);
    } else {
      this.updateAboutUsInfoData(this.selectedAboutUsData().id, formData);
    }
  }

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/about-us-crud']);
  }
}
