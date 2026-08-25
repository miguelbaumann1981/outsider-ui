import { Component, computed, input } from '@angular/core';
import { ArticleCard } from '../../interfaces/article-card.interface';
import es from '@/i18n/es.json';

@Component({
  selector: 'out-article-home-card',
  imports: [],
  templateUrl: './article-home-card.html',
  styles: `
    .custom-card {
      &:hover {
        background-color: #ffdbd6;
      }
    }
  `,
})
export class ArticleHomeCard {
  protected readonly i18n = es;
  article = input.required<ArticleCard>();

  hoverColor = computed<string>(() => {
    const color = this.article().hoverColor ?? '#FFDBD6';
    return `hover:bg-[${color}]`;
  });
}
