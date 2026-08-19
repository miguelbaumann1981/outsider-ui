import { ArticleCategory } from '../enums';
import { Gender, Release } from '../types';

export interface ArticlesApi {
  total: number;
  articles: Article2[];
}

export interface Article {
  title: string;
  subtitle: string;
  slug: string;
  category: ArticleCategory;
  author: string;
  image: string;
  createdAt: Date;
  release: Release;
  content: string;
  id: string;
}

export interface ArticlesApi2 {
  total: number;
  articles: Article2[];
}

export interface Article2 {
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
