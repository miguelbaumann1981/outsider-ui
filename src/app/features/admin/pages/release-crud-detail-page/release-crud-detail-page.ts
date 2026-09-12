import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, DestroyRef, inject, signal, OnInit, computed } from '@angular/core';
import es from '@/i18n/es.json';
import { apply, disabled, form, FormField, FormRoot, schema } from '@angular/forms/signals';
import { ReleasesCrud } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ReleasesApi } from '@/features/public/interfaces';
import { ReleasesService } from '@/features/public/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { releaseSchemaBase } from './release-crud-form-schema';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { delay } from 'rxjs';
import { ReleaseCode } from '@/features/public/types';

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
export class ReleaseCrudDetailPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private releasesService = inject(ReleasesService);

  activeParam = signal<string | 'new'>('');
  allReleases = signal<ReleasesApi[]>([]);
  selectedRelease = signal<ReleasesApi>({} as ReleasesApi);
  isLoading = signal(false);
  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.releases.createNewRelease
      : this.i18n.releases.editRelease,
  );
  newIndexRelease = computed<number>(() => this.allReleases().length + 1);

  releaseSchema = schema<ReleasesCrud>((path) => {
    apply(path, releaseSchemaBase);
    disabled(path.releaseCode, { when: () => this.activeParam() !== 'new' });
    disabled(path.index);
  });

  releaseModel = signal<ReleasesCrud>({ ...RELEASE_MODEL, index: this.newIndexRelease() });

  readonly releaseForm = form(this.releaseModel, this.releaseSchema);

  ngOnInit(): void {
    this.getReleasesApi();
    this.handleCrudRelease();
  }

  handleCrudRelease(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.activeParam.set(params['id']);

      if (this.activeParam() !== 'new') {
        this.getSelectedRelease(this.activeParam());
      }
    });
  }

  getReleasesApi(): void {
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.allReleases.set(data ?? []);
          if (this.activeParam() === 'new') {
            this.releaseModel.update((model) => ({
              ...model,
              index: this.newIndexRelease(),
            }));
          }
        },
        error: (error) => {
          toast.error(error ?? this.i18n.common.serverError);
        },
      });
  }

  getSelectedRelease(id: string): void {
    this.isLoading.set(true);
    this.releasesService
      .getReleaseById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.selectedRelease.set(data);
          this.releaseModel.set(this.selectedRelease());
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

  checkCodeReleaseIsAvailable(code: ReleaseCode): boolean {
    return this.allReleases().some((item) => item.releaseCode === code);
  }

  createNewRelease(formData: ReleasesCrud): void {
    this.releasesService
      .createRelease(formData)
      .pipe(takeUntilDestroyed(this.destroyRef), delay(1500))
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
            this.navigateToPreviousPage();
          }, 1500);
        },
      });
  }

  editRelease(formData: ReleasesCrud): void {
    this.releasesService
      .updateRelease(this.activeParam(), formData)
      .pipe(takeUntilDestroyed(this.destroyRef), delay(1500))
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
            this.navigateToPreviousPage();
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

  navigateToPreviousPage(): void {
    this.router.navigate(['/admin/releases-crud']);
  }
}
