import { Pipe, type PipeTransform } from '@angular/core';
import es from '@/i18n/es.json';
import { ArticleCategory } from '../enums/article-category.enum';

@Pipe({
  name: 'articleSection',
})
export class ArticleSectionPipe implements PipeTransform {
  protected readonly i18n = es;

  transform(value: ArticleCategory): string {
    switch (value) {
      case ArticleCategory.BOOKSYEAR:
        return this.i18n.category.booksYear;
      case ArticleCategory.EDITORIAL:
        return this.i18n.category.editorialArticle;
      case ArticleCategory.MICROSTORY:
        return this.i18n.category.microStories;
      case ArticleCategory.TALES:
        return this.i18n.category.nightTales;
      case ArticleCategory.OPINION:
        return this.i18n.category.ourLifeBooks;
      case ArticleCategory.OUTSIDERS:
        return this.i18n.category.strongholds;

      default:
        return value;
    }
  }
}
