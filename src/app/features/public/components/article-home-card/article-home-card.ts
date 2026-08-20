import { Component, computed, input } from '@angular/core';
import { ArticleCard } from '../../interfaces/article-card.interface';
import es from '@/i18n/es.json';
import { getColorCategory, getColorHoverCategory, getFontFamilyCategory } from '../../utils';

@Component({
  selector: 'out-article-home-card',
  imports: [],
  templateUrl: './article-home-card.html',
})
export class ArticleHomeCard {
  protected readonly i18n = es;
  article = input.required<ArticleCard>();

  fontFamily = computed<string>(() => {
    return getFontFamilyCategory(this.article()?.section);
  });

  color = computed<string>(() => {
    return getColorCategory(this.article()?.section);
  });

  hoverColor = computed<string>(() => {
    return getColorHoverCategory(this.article()?.section);
  });
}
