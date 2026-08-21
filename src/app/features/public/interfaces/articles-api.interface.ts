import { ArticleCategory } from '../enums';
import { Gender, Release, Template } from '../types';

export interface ArticlesApi {
  total: number;
  articles: Article[];
}

export interface Article {
  authorArticle: string;
  authorInfo: string;
  authorQuote: string;
  category: ArticleCategory;
  content: string;
  contentGroup: ContentArticlesGroup[];
  gender: Gender;
  id: string;
  image: string;
  quote: string;
  references: string;
  release: Release;
  slug: string;
  template: Template;
  titleArticle: string;
  titleCategory: string;
}

export interface ContentArticlesGroup {
  author: string;
  document: string;
  gender: Gender;
  history: string;
  title: string;
}
