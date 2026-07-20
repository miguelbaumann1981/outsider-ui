import { ArticleCategory } from '../enums/article-category.enum';
import { OrientationLayoutArticles } from '../types/orientation-layout-articles.type';
import { PositionLayoutArticles } from '../types/position-layout-articles.type';

export interface LayoutArticlesApi {
  title: string;
  position: PositionLayoutArticles;
  orientation: OrientationLayoutArticles;
  category: ArticleCategory;
  id: string;
}
