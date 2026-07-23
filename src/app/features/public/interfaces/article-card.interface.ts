import { Release } from '../enums';
import { ArticleCategory } from '../enums/article-category.enum';
import { OrientationLayoutArticles } from '../types/orientation-layout-articles.type';
import { PositionLayoutArticles } from '../types/position-layout-articles.type';

export interface ArticleCard {
  section: ArticleCategory;
  title: string;
  author: string;
  id: string;
  slug: string;
  release: Release;
  imageUrl: string;
  imageLayout: OrientationLayoutArticles;
  position: PositionLayoutArticles;
}
