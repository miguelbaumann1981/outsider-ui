import { ArticleCategory } from '../enums';
import { Gender, Release, Template } from '../types';

export interface CategoryPoetry {
  authorArticle: string;
  category: ArticleCategory.POETRY;
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
