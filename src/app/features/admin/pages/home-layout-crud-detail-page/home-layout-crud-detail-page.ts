import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import es from '@/i18n/es.json';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService, ReleasesService } from '@/features/public/services';
import { HomeLayoutApi, ReleasesApi } from '@/features/public/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColorPicker } from '../../components/color-picker/color-picker';

interface HomeLayoutCard extends HomeLayoutApi {
  title: string;
}

@Component({
  selector: 'out-home-layout-crud-detail',
  imports: [SubtitlePage, NgxSonnerToaster, ColorPicker],
  templateUrl: './home-layout-crud-detail-page.html',
})
export class HomeLayoutCrudDetailPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private homeService = inject(HomeService);
  private releasesService = inject(ReleasesService);

  activeParam = signal<string | 'new'>('');
  homeLayouts = signal<HomeLayoutCard[]>([]);
  releases = signal<ReleasesApi[]>([]);

  subtitlePage = computed<string>(() =>
    this.activeParam() === 'new'
      ? this.i18n.releases.createNewRelease
      : this.i18n.releases.editRelease,
  );

  colorPicker = signal('');

  ngOnInit(): void {
    this.getHomeLayoutsApi();
    this.handleCrudRelease();
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

  handleCrudRelease(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.activeParam.set(params['id']);

      if (this.activeParam() !== 'new') {
        // this.getSelectedRelease(this.activeParam());
      }
    });
  }
}
