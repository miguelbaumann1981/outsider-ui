import { AboutUsService } from '@/features/public/services';
import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import es from '@/i18n/es.json';
import { AboutUsApi } from '@/features/public/interfaces';
import { AboutUsCrud, ReleaseCodeSelect } from '../../interfaces';
import { ReleaseCode } from '@/features/public/types';
import { aboutUsSchemaBase } from './about-us-crud-form-schema';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { InputTextRichForm } from '@/shared/components/input-text-rich-form/input-text-rich-form';
import { SetInitReleaseService } from '@/core/services';
import { HandleEditMode } from '../../services';
import { lastValueFrom, map } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { staleTime } from '@/features/public/utils';

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

@Component({
  selector: 'out-about-us-crud-detail-page',
  imports: [SubtitlePage, FormField, FormRoot, NgxSonnerToaster, InputTextRichForm],
  templateUrl: './about-us-crud-detail-page.html',
})
export class AboutUsCrudDetailPage {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private aboutUsService = inject(AboutUsService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private handleEditMode = inject(HandleEditMode);

  isLoading = signal(false);
  activeParam = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])), {
    initialValue: '',
  });

  readonly aboutUsApi = injectQuery(() => ({
    queryKey: ['infoAboutUsApi'],
    queryFn: () => lastValueFrom(this.aboutUsService.getAboutUsInfo()),
    staleTime,
  }));
  readonly selectedAboutUsData = injectQuery(() => ({
    queryKey: ['release', this.activeParam()],
    queryFn: () => lastValueFrom(this.aboutUsService.getAboutUsInfoById(this.activeParam())),
    enabled: this.activeParam() !== '' && this.activeParam() !== 'new',
    staleTime,
  }));
  readonly releasesApi = this.setInitReleasesService.releases;

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

  optionReleaseCodeSelected = signal<ReleaseCode>('');

  activeLayouts = computed<ReleaseCode[]>(() => this.aboutUsData().map((elem) => elem.releaseCode));

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.aboutUs.createNewAboutUsInfo
      : this.i18n.aboutUs.editAboutUsInfo,
  );
  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    return (
      this.releasesApi.data()?.map((item) => ({
        code: item.releaseCode,
        displayName: item.name,
        disabled: this.activeLayouts()?.includes(item.releaseCode),
      })) ?? []
    );
  });
  releasesCodeCloneOptions = computed<ReleaseCodeSelect[]>(() => {
    return (
      this.releasesApi.data()?.map((item) => ({
        code: item.releaseCode,
        displayName: item.name,
        disabled: !this.activeLayouts()?.includes(item.releaseCode),
      })) ?? []
    );
  });

  aboutUsModel = signal<AboutUsCrud>(ABOUT_US_MODEL);
  aboutUsSchema = schema<AboutUsCrud>((path) => {
    apply(path, aboutUsSchemaBase);

    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
  });

  private syncAboutUsModel = effect(() => {
    if (this.activeParam() === 'new') {
      this.aboutUsModel.set(ABOUT_US_MODEL);
    } else {
      this.aboutUsModel.set(this.selectedAboutUsData.data() ?? ABOUT_US_MODEL);
    }
  });

  readonly aboutUsForm = form(this.aboutUsModel, this.aboutUsSchema);

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
            this.navigateToPreviousPage(true);
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
            this.navigateToPreviousPage(true);
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
      this.updateAboutUsInfoData(this.selectedAboutUsData.data()?.id ?? '', formData);
    }
  }

  navigateToPreviousPage(isEdited?: boolean): void {
    this.router.navigate(['/admin/about-us-crud']);
    this.handleEditMode.setEditMode(isEdited ?? false);
  }
}
