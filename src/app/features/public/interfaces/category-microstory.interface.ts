import { ArticleCategory } from '../enums';
import { Gender, Release, Template } from '../types';
import { ContentArticlesGroup } from './articles-api.interface';

export interface CategoryMicrostory {
  authorArticle: string;
  authorInfo: string;
  category: ArticleCategory.MICROSTORY;
  contentGroup: ContentArticlesGroup[];
  gender: Gender;
  id: string;
  image: string;
  release: Release;
  slug: string;
  template: Template;
  titleArticle: string;
  titleCategory: string;
}
