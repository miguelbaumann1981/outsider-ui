import {
  AfterViewInit,
  Component,
  signal,
  PLATFORM_ID,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { ArticleHomeCard } from '../../components/article-home-card/article-home-card';
import { ArticleCard } from '../../interfaces/article-card.interface';
import es from '@/i18n/es.json';
import { HomeService } from '../../services/home.service';
import { forkJoin } from 'rxjs';
import { Release } from '../../enums/release.enum';
import { ArticlesApi } from '../../interfaces/articles-api.interface';
import { LayoutArticlesApi } from '../../interfaces/layout-articles-api.interface';

@Component({
  selector: 'out-home-page',
  imports: [ArticleHomeCard],
  templateUrl: './home-page.html',
  styles: `
    .slogan {
      color: gray;
      font-size: clamp(2rem, 10rem, 4vw);
      line-height: 1.2;
      box-sizing: border-box;
      padding: 3%;
      width: 100%;
      text-align: center;
      perspective: 500px;
      font-weight: 500;
      // font-family: 'Fredoka', sans-serif;
      text-shadow: 1px 1px 2px rgba($color: #000, $alpha: 0.5);
    }
  `,
})
export class HomePage implements OnInit, AfterViewInit {
  protected readonly i18n = es;
  homeService = inject(HomeService);
  private platformId = inject(PLATFORM_ID);

  fontFamilyStyle = signal('fredoka-regular');
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  layoutArticlesApi = signal<LayoutArticlesApi[]>([]);
  articlesRelease = computed<ArticleCard[]>(() => {
    const articles = this.articlesApi()?.articles ?? [];
    const layout = this.layoutArticlesApi() ?? [];

    return articles
      .map((item) => ({
        section: item.category,
        title: item.title,
        author: item.author,
        id: item.id,
        imageUrl: item.image,
        imageLayout: layout.find((elem) => elem.category === item.category)?.orientation ?? 'left',
        position: layout.find((elem) => elem.category === item.category)?.position ?? 1,
      }))
      .sort((a, b) => a.position - b.position);
  });

  ngOnInit(): void {
    this.getArticlesHomePage();
    console.log(this.articlesRelease());
  }

  getArticlesHomePage(): void {
    forkJoin([
      this.homeService.getArticles(Release.RELEASED),
      this.homeService.getLayoutArticles(),
    ]).subscribe(([articlesData, layoutData]) => {
      this.articlesApi.set(articlesData);
      this.layoutArticlesApi.set(layoutData);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { SplitText } = await import('gsap/SplitText');
    gsap.registerPlugin(SplitText);

    const split = new SplitText('#slogan', {
      type: 'chars',
    });

    gsap.from(split.chars, {
      x: 150,
      opacity: 0,
      duration: 0.7,
      ease: 'power4',
      stagger: 0.04,
    });
  }
}
