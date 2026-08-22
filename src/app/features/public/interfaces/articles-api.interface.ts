import { ArticleCategory } from '../enums';
import { Release } from '../types';

export interface ArticlesApi {
  total: number;
  articles: Article[];
}

export interface Article {
  authorArticle: string;
  authorInfo?: string;
  authorQuote?: string;
  category: ArticleCategory;
  content: string;
  id: string;
  image: string;
  quote?: string;
  references: string;
  release: Release;
  slug: string;
  subtitle?: string;
  titleArticle: string;
  titleCategory: string;
}
