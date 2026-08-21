import { ArticleCategory } from '../enums';
import { Gender, Release, Template } from '../types';

export interface CategoryEditorial {
  authorArticle: string;
  category: ArticleCategory.EDITORIAL;
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
