import { ArticleCategory } from '../enums';
import { Gender, Release } from '../types';

export interface CategoryTales {
  authorArticle: string;
  authorInfo: string;
  authorQuote: string;
  category: ArticleCategory.TALES;
  content: string;
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
