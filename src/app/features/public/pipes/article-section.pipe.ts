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
      case ArticleCategory.BOOKS_YEAR:
        return this.i18n.category.booksYear;
      case ArticleCategory.EDITORIAL_ARTICLE:
        return this.i18n.category.editorialArticle;
      case ArticleCategory.MICRO_STORIES:
        return this.i18n.category.microStories;
      case ArticleCategory.NIGHT_TALES:
        return this.i18n.category.nightTales;
      case ArticleCategory.OUR_LIFE_BOOKS:
        return this.i18n.category.ourLifeBooks;
      case ArticleCategory.STRONGHOLDS:
        return this.i18n.category.strongholds;

      default:
        return value;
    }
  }
}
