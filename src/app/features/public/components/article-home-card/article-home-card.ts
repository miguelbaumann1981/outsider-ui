import { Component, input } from '@angular/core';
import { ArticleCard } from '../../interfaces/article-card.interface';
import { NgClass } from '@angular/common';
import { ArticleSectionPipe } from '../../pipes/article-section.pipe';
import { ArticleCategory } from '../../enums/article-category.enum';
import es from '@/i18n/es.json';

@Component({
  selector: 'out-article-home-card',
  imports: [NgClass, ArticleSectionPipe],
  templateUrl: './article-home-card.html',
})
export class ArticleHomeCard {
  protected readonly i18n = es;
  article = input.required<ArticleCard>();

  getFontFamily(section: ArticleCategory): string {
    switch (section) {
      case ArticleCategory.BOOKSYEAR:
        return 'gravitas-one-regular text-2xl';
      case ArticleCategory.EDITORIAL:
        return 'homemade-apple-regular text-4xl';
      case ArticleCategory.MICROSTORY:
        return 'special-elite-regular text-4xl';
      case ArticleCategory.TALES:
        return 'carter-one-regular text-3xl';
      case ArticleCategory.OPINION:
        return 'fredoka-regular text-4xl';
      case ArticleCategory.OUTSIDERS:
        return 'zen-dots-regular text-3xl';

      default:
        return '';
    }
  }
}
