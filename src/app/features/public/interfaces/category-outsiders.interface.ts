import { ArticleCategory } from '../enums';
import { Gender, Release } from '../types';

export interface CategoryOutsiders {
  authorArticle: string;
  category: ArticleCategory.OUTSIDERS;
  content: string;
  gender: Gender;
  id: string;
  image: string;
  release: Release;
  slug: string;
  titleArticle: string;
  titleCategory: string;
}
