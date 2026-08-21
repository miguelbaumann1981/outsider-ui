import { ArticleCategory } from '../enums';
import {
  Article,
  CategoryEditorial,
  CategoryMicrostory,
  CategoryOpinion,
  CategoryOutsiders,
  CategoryPoetry,
  CategoryTales,
} from '../interfaces';

export class ArticleCategoryMapper {
  static editorial(data: Article): CategoryEditorial {
    return {
      authorArticle: data.authorArticle,
      category: ArticleCategory.EDITORIAL,
      content: data.content,
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      template: data.template,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static tales(data: Article): CategoryTales {
    return {
      authorArticle: data.authorArticle,
      authorInfo: data.authorInfo,
      authorQuote: data.authorQuote,
      category: ArticleCategory.TALES,
      content: data.content,
      gender: data.gender,
      id: data.id,
      image: data.image,
      quote: data.quote,
      references: data.references,
      release: data.release,
      slug: data.slug,
      template: data.template,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static poetry(data: Article): CategoryPoetry {
    return {
      authorArticle: data.authorArticle,
      category: ArticleCategory.POETRY,
      content: data.content,
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      template: data.template,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static microstory(data: Article): CategoryMicrostory {
    return {
      authorArticle: data.authorArticle,
      authorInfo: data.authorInfo,
      category: ArticleCategory.MICROSTORY,
      contentGroup: data.contentGroup,
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      template: data.template,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static opinion(data: Article): CategoryOpinion {
    return {
      authorArticle: data.authorArticle,
      authorInfo: data.authorInfo,
      category: ArticleCategory.OPINION,
      content: data.content,
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      template: data.template,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static outsiders(data: Article): CategoryOutsiders {
    return {
      authorArticle: data.authorArticle,
      category: ArticleCategory.OUTSIDERS,
      content: data.content,
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      template: data.template,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }
}
