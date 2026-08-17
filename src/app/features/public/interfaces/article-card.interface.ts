import { Release } from '../enums';
import { ArticleCategory } from '../enums/article-category.enum';
import { PositionLayoutArticles } from '../types/position-layout-articles.type';

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
