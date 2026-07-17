import { AfterViewInit, Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { ArticleHomeCard } from '../../components/article-home-card/article-home-card';
import { ArticleCard } from '../../interfaces/article-card.interface';
import { ArticleCategory } from '../../enums/article-category.enum';
import es from '@/i18n/es.json';
import { setInterval } from 'timers/promises';

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
export class HomePage implements AfterViewInit {
  protected readonly i18n = es;
  article1 = signal<ArticleCard>({
    id: '111',
    section: ArticleCategory.EDITORIAL_ARTICLE,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'left',
  });
  article2 = signal<ArticleCard>({
    id: '222',
    section: ArticleCategory.NIGHT_TALES,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'right',
  });
  article3 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.MICRO_STORIES,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'left',
  });
  article4 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.BOOKS_YEAR,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'right',
  });
  article5 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.OUR_LIFE_BOOKS,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'left',
  });
  article6 = signal<ArticleCard>({
    id: '333',
    section: ArticleCategory.STRONGHOLDS,
    title: 'La ciudad que nunca olvida',
    author: 'Miguel Baumann',
    imageUrl: '/assets/foto-libros.jpg',
    imageLayout: 'right',
  });

  fontFamilyStyle = signal('fredoka-regular');

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

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
