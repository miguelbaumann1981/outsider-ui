import { ArticleCategory } from '../enums';
import { PositionLayoutArticles, Release } from '../types';

export interface ArticleCard {
  author: string;
  color: string;
  hoverColor: string;
  id: string;
  imageUrl: string;
  name: string;
  position: PositionLayoutArticles;
  release: Release;
  section: ArticleCategory;
  slug: string;
  title: string;
}
