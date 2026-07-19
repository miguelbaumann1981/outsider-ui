import {
  AfterViewInit,
  Component,
  signal,
  Inject,
  PLATFORM_ID,
  inject,
  resource,
  OnInit,
} from '@angular/core';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { ArticleHomeCard } from '../../components/article-home-card/article-home-card';
import { ArticleCard } from '../../interfaces/article-card.interface';
import { ArticleCategory } from '../../enums/article-category.enum';
import es from '@/i18n/es.json';
import { setInterval } from 'timers/promises';
import { httpResource } from '@angular/common/http';
import { HomeService } from '../../services/home.service';

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
  article1 = signal<ArticleCard>({
    id: '111',
    section: ArticleCategory.EDITORIAL,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'left',
  });
  article2 = signal<ArticleCard>({
    id: '222',
    section: ArticleCategory.TALES,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'right',
  });
  article3 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.MICROSTORY,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'left',
  });
  article4 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.BOOKSYEAR,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'right',
  });
  article5 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.OPINION,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'left',
  });
  article6 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.OUTSIDERS,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'right',
  });

  fontFamilyStyle = signal('fredoka-regular');

  homeService = inject(HomeService);

  articlesApi = httpResource(() => ({
    url: 'http://localhost:3000/api/articles',
  }));

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.getArticlesHomePage();
  }

  getArticlesHomePage(): void {
    this.homeService.getArticles().subscribe((data) => {
      console.log(data);
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
