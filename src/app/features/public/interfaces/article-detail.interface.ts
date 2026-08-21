import { ArticleCategory, Release } from '../types';

export interface ArticleDetail {
  category: ArticleCategory;
  release: Release;
  slug: string;
}
