import { ArticleCategory } from '../enums';
import { Gender, Release, Template } from '../types';

export interface CategoryOutsiders {
  authorArticle: string;
  category: ArticleCategory.OUTSIDERS;
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
