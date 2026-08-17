import { ArticleCategory } from '../enums';
import {
  Article2,
  CategoryEditorial,
  CategoryMicrostory,
  CategoryOpinion,
  CategoryOutsiders,
  CategoryPoetry,
  CategoryTales,
} from '../interfaces';

export class ArticleCategoryMapper {
  static editorial(data: Article2): CategoryEditorial {
    return {
      authorArticle: data.authorArticle,
      category: ArticleCategory.EDITORIAL,
      content: data.content,
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static tales(data: Article2): CategoryTales {
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
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static poetry(data: Article2): CategoryPoetry {
    return {
      authorArticle: data.authorArticle,
      authorInfo: data.authorInfo,
      category: ArticleCategory.POETRY,
      contentGroup: data.contentGroup.map((group) => ({
        title: group.title,
        document: group.document,
      })),
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static microstory(data: Article2): CategoryMicrostory {
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
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static opinion(data: Article2): CategoryOpinion {
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
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }

  static outsiders(data: Article2): CategoryOutsiders {
    return {
      authorArticle: data.authorArticle,
      category: ArticleCategory.OUTSIDERS,
      content: data.content,
      gender: data.gender,
      id: data.id,
      image: data.image,
      release: data.release,
      slug: data.slug,
      titleArticle: data.titleArticle,
      titleCategory: data.titleCategory,
    };
  }
}
