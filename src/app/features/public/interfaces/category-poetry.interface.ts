import { ArticleCategory } from '../enums';
import { Gender, Release } from '../types';

export interface CategoryPoetry {
  authorArticle: string;
  authorInfo: string;
  category: ArticleCategory.POETRY;
  contentGroup: PoetryContentGroup[];
  gender: Gender;
  id: string;
  image: string;
  release: Release;
  slug: string;
  titleArticle: string;
  titleCategory: string;
}

export interface PoetryContentGroup {
  title: string;
  document: string;
}
