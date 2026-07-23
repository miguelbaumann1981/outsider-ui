import { Component, computed, input } from '@angular/core';
import { ArticleCard } from '../../interfaces/article-card.interface';
import { NgClass } from '@angular/common';
import { ArticleSectionPipe } from '../../pipes/article-section.pipe';
import es from '@/i18n/es.json';
import { getFontFamilyCategory } from '../../utils';

@Component({
  selector: 'out-article-home-card',
  imports: [NgClass, ArticleSectionPipe],
  templateUrl: './article-home-card.html',
})
export class ArticleHomeCard {
  protected readonly i18n = es;
  article = input.required<ArticleCard>();

  fontFamily = computed<string>(() => {
    return getFontFamilyCategory(this.article()?.section);
  });
}
