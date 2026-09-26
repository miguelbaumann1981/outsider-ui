import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, DestroyRef, inject, signal, computed, effect } from '@angular/core';
import es from '@/i18n/es.json';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { ReleasesCrud } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ReleasesApi } from '@/features/public/interfaces';
import { ReleasesService } from '@/features/public/services';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { releaseSchemaBase } from './release-crud-form-schema';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { ReleaseCode } from '@/features/public/types';
import { SetInitReleaseService } from '@/core/services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { staleTime } from '@/features/public/utils';
import { lastValueFrom, map } from 'rxjs';
import { HandleEditMode } from '../../services';

const RELEASE_MODEL: ReleasesCrud = {
  name: '',
  month: '',
  year: 0,
  releaseCode: '',
  index: 0,
  isDraft: false,
  isPublished: false,
  isCurrentRelease: false,
};

@Component({
  selector: 'out-release-crud-detail-page',
  imports: [SubtitlePage, FormField, FormRoot, NgxSonnerToaster],
  templateUrl: './release-crud-detail-page.html',
})
export class ReleaseCrudDetailPage {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private releasesService = inject(ReleasesService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private handleEditMode = inject(HandleEditMode);

  isLoading = signal(false);
  activeParam = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])), {
    initialValue: '',
  });

  readonly releasesApi = this.setInitReleasesService.releases;
  readonly selectedRelease = injectQuery(() => ({
    queryKey: ['release', this.activeParam()],
    queryFn: () => lastValueFrom(this.releasesService.getReleaseById(this.activeParam())),
    enabled: this.activeParam() !== '' && this.activeParam() !== 'new',
    staleTime,
  }));

  allReleases = computed<ReleasesApi[]>(() => this.releasesApi.data() ?? []);
  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.releases.createNewRelease
      : this.i18n.releases.editRelease,
  );
  newIndexRelease = computed<number>(() => this.allReleases()?.length + 1);

  releaseSchema = schema<ReleasesCrud>((path) => {
    apply(path, releaseSchemaBase);
    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
    disabled(path.index);
  });

  releaseModel = signal<ReleasesCrud>({ ...RELEASE_MODEL });

  private syncReleaseModel = effect(() => {
    if (this.activeParam() === 'new') {
      this.releaseModel.set({ ...RELEASE_MODEL, index: this.newIndexRelease() });
    } else {
      this.releaseModel.set(this.selectedRelease.data() ?? RELEASE_MODEL);
    }
  });

  readonly releaseForm = form(this.releaseModel, this.releaseSchema);

  checkCodeReleaseIsAvailable(code: ReleaseCode): boolean {
    return this.allReleases().some((item) => item.releaseCode === code);
  }

  createNewRelease(formData: ReleasesCrud): void {
    this.releasesService
      .createRelease(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.releases.successCreateMessageForm);
        },
        error: () => {
          toast.error(this.i18n.releases.errorCreateMessageForm);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
          this.releaseForm().reset(RELEASE_MODEL);
          setTimeout(() => {
            this.navigateToPreviousPage(true);
          }, 1500);
        },
      });
  }

  editRelease(formData: ReleasesCrud): void {
    this.releasesService
      .updateRelease(this.activeParam(), formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(this.i18n.releases.successEditMessageForm);
        },
        error: () => {
          toast.error(this.i18n.releases.errorEditMessageForm);
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
    this.releaseModel().isDraft = true;
    this.releaseModel().isPublished = false;
    const formData = this.releaseModel();

    if (this.activeParam() === 'new') {
      if (this.checkCodeReleaseIsAvailable(this.releaseModel().releaseCode)) {
        this.isLoading.set(false);
        toast.error(this.i18n.releases.validations.codeReleaseAlreadyExists);
        return;
      }
      this.createNewRelease(formData);
    } else {
      this.editRelease(formData);
    }
  }

  navigateToPreviousPage(isEdited?: boolean): void {
    this.router.navigate(['/admin/releases-crud']);
    this.handleEditMode.setEditMode(isEdited ?? false);
  }
}
