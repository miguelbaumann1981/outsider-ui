import { ArticleCategory } from '../enums';
import { Gender, Release } from '../types';
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
  titleArticle: string;
  titleCategory: string;
}
