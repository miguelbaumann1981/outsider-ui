import { Component, input } from '@angular/core';
import { ArticleCard } from '../../interfaces/article-card.interface';
import es from '@/i18n/es.json';
import { ImgFallbackDirective } from '../../directives';

@Component({
  selector: 'out-article-home-card',
  imports: [ImgFallbackDirective],
  templateUrl: './article-home-card.html',
})
export class ArticleHomeCard {
  protected readonly i18n = es;
  article = input.required<ArticleCard>();
}
