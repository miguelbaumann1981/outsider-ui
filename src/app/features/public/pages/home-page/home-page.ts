import {
  AfterViewInit,
  Component,
  signal,
  PLATFORM_ID,
  inject,
  computed,
  OnInit,
} from '@angular/core';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { ArticleHomeCard } from '../../components/article-home-card/article-home-card';
import { ArticleCard } from '../../interfaces/article-card.interface';
import es from '@/i18n/es.json';
import { ReleaseLocalStorage } from '../../interfaces';
import { Router } from '@angular/router';
import { HomeService, ReleasesService } from '../../services';
import { SkeletonCard } from '@/shared/components/skeleton-card/skeleton-card';
import { ReleaseCode, ViewState } from '../../types';
import { LocalStorageService, SetInitReleaseService } from '@/core/services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { staleTime } from '../../utils';

@Component({
  selector: 'out-home-page',
  imports: [ArticleHomeCard, SkeletonCard],
  templateUrl: './home-page.html',
  styles: `
    .title {
      font-size: clamp(3rem, 12rem, 7vw);
      line-height: 1.2;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      perspective: 500px;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba($color: #000, $alpha: 0.5);
    }

    .slogan {
      color: gray;
      line-height: 1.2;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      perspective: 500px;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba($color: #000, $alpha: 0.5);
      font-size: clamp(0.75rem, 6rem, 2.5vw);
    }

    @media (max-width: 640px) {
      .slogan {
        font-size: 20px;
      }
    }
  `,
})
export class HomePage implements OnInit, AfterViewInit {
  protected readonly i18n = es;
  private homeService = inject(HomeService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private platformId = inject(PLATFORM_ID);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  title = signal('Outsider');
  releaseCodeLocalStorage = computed<ReleaseCode>(() => {
    if (this.localStorageService.getItem('release')) {
      const releaseLS: ReleaseLocalStorage = JSON.parse(
        this.localStorageService.getItem('release') ?? '',
      );
      return releaseLS.code;
    }
    return '';
  });

  readonly releases = this.setInitReleasesService.releases;
  releaseName = computed<string>(() => {
    return (
      this.releases.data()?.find((item) => item.releaseCode === this.releaseCodeLocalStorage())
        ?.name ?? ''
    );
  });

  readonly articlesApi = injectQuery(() => ({
    queryKey: ['articlesApi', this.releaseCodeLocalStorage()],
    queryFn: () => lastValueFrom(this.homeService.getArticles(this.releaseCodeLocalStorage())),
    staleTime,
  }));
  readonly homeLayoutApi = injectQuery(() => ({
    queryKey: ['homeLayoutApi'],
    queryFn: () => lastValueFrom(this.homeService.getHomeLayout()),
    staleTime,
  }));

  articlesRelease = computed<ArticleCard[]>(() => {
    const articles = this.articlesApi.data()?.articles ?? [];
    const layoutFeatures =
      this.homeLayoutApi.data()?.find((item) => item.releaseCode === this.releaseCodeLocalStorage())
        ?.features ?? [];

    return articles
      .map((item) => ({
        category: item.category,
        name: item.titleCategory,
        title: item.titleArticle,
        author: item.authorArticle,
        id: item.id,
        slug: item.slug,
        releaseCode: item.releaseCode,
        imageUrl: item.image,
        position: layoutFeatures.find((elem) => elem.category === item.category)?.position ?? 0,
        color:
          layoutFeatures.find((elem) => elem.category === item.category)?.color?.solid ?? '#eeeeee',
        hoverColor:
          layoutFeatures.find((elem) => elem.category === item.category)?.color?.hover ?? '#f4f4f4',
      }))
      .sort((a, b) => a.position - b.position);
  });

  viewState = computed<ViewState>(() => {
    if (this.articlesApi.isLoading() || this.homeLayoutApi.isLoading() || this.releases.isLoading())
      return 'loading';
    if (this.articlesApi.isError() || this.homeLayoutApi.isError() || this.releases.isError())
      return 'error';
    if (this.articlesRelease().length > 0) return 'available';
    return 'empty';
  });

  ngOnInit(): void {
    this.setInitReleasesService.setInitReleaseLocalStorage();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { SplitText } = await import('gsap/SplitText');
    gsap.registerPlugin(SplitText);

    const splitTitle = new SplitText('#title', {
      type: 'chars',
    });

    gsap.from(splitTitle.chars, {
      x: 150,
      opacity: 0,
      duration: 1.5,
      ease: 'power4',
      stagger: 0.04,
    });

    const splitSlogan = new SplitText('#slogan', {
      type: 'chars',
    });

    gsap.from(splitSlogan.chars, {
      x: 150,
      opacity: 0,
      duration: 0.7,
      ease: 'power4',
      stagger: 0.04,
    });
  }

  navigateToDetail(article: ArticleCard) {
    const { releaseCode, slug, category } = article;
    const release: ReleaseLocalStorage = {
      code: releaseCode,
      isCurrent:
        this.releases.data()?.find((item) => item.releaseCode === releaseCode)?.isCurrentRelease ??
        false,
    };
    this.localStorageService.setItem('release', JSON.stringify(release));
    this.router.navigate([`/articles/${releaseCode.toLowerCase()}/${category}/${slug}`]);
  }
}
