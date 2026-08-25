import { Component, computed, input } from '@angular/core';
import { ArticleCard } from '../../interfaces/article-card.interface';
import es from '@/i18n/es.json';
import { getColorHoverCategory } from '../../utils';
import { ImgFallbackDirective } from '../../directives';

@Component({
  selector: 'out-article-home-card',
  imports: [ImgFallbackDirective],
  templateUrl: './article-home-card.html',
  styles: ``,
})
export class ArticleHomeCard {
  protected readonly i18n = es;
  article = input.required<ArticleCard>();

  hoverColor = computed<string>(() => {
    const color = this.article()?.hoverColor ?? '#FFDBD6';
    return `hover:bg-[${color}]`;
  });

  hoverColor2 = computed<string>(() => {
    return getColorHoverCategory(this.article()?.section);
  });

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'foto-libros.jpg'; // ubicado en /public/fallback.jpg
  }
}
