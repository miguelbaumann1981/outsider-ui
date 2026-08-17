import { ArticleCategory } from '../enums';
import { Gender, Release } from '../types';

export interface CategoryOpinion {
  authorArticle: string;
  authorInfo: string;
  category: ArticleCategory.OPINION;
  content: string;
  gender: Gender;
  id: string;
  image: string;
  release: Release;
  slug: string;
  titleArticle: string;
  titleCategory: string;
}
