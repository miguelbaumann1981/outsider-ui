import { ArticleCategory } from '../enums';
import { PositionLayoutArticles, Release } from '../types';

export interface ArticleCard {
  section: ArticleCategory;
  title: string;
  author: string;
  id: string;
  slug: string;
  release: Release;
  imageUrl: string;
  position: PositionLayoutArticles;
}
