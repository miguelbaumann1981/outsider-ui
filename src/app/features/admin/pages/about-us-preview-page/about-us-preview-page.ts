import { AboutUsApi } from '@/features/public/interfaces';
import { SafeHtmlPipe } from '@/features/public/pipes';
import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import es from '@/i18n/es.json';
import { AboutUsService } from '@/features/public/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TitlePage } from '@/shared/components/title-page/title-page';

@Component({
  selector: 'out-about-us-preview-page',
  imports: [SafeHtmlPipe, NgClass, TitlePage],
  templateUrl: './about-us-preview-page.html',
  styleUrl: '../../../public/pages/about-us-page/about-us-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AboutUsPreviewPage implements OnInit {
  protected readonly i18n = es;
  private destroyRef = inject(DestroyRef);
  private aboutUsService = inject(AboutUsService);
  private activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  info = signal<AboutUsApi>({} as AboutUsApi);
  activeParam = signal<string>('');

  ngOnInit(): void {
    this.handleAboutUsId();
  }

  handleAboutUsId(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.activeParam.set(params['id']);
      this.getAboutUsInfo(this.activeParam());
    });
  }

  getAboutUsInfo(id: string): void {
    this.aboutUsService
      .getAboutUsInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const selectedInfo = data.find((item) => item.id === id) ?? ({} as AboutUsApi);
          console.log(data);
          this.info.set(selectedInfo);
        },
      });
  }

  backToAboutUsCrud(): void {
    this.router.navigate(['/admin/about-us-crud']);
  }
}
