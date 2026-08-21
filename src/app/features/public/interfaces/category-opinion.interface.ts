import { ArticleCategory } from '../enums';
import { Gender, Release, Template } from '../types';

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
  template: Template;
  titleArticle: string;
  titleCategory: string;
}
