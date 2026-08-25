import { ArticleCategory } from '../enums/article-category.enum';
import { PositionLayoutArticles } from '../types/position-layout-articles.type';

export interface LayoutArticlesApi {
  category: ArticleCategory;
  color: ColorCategory;
  id: string;
  position: PositionLayoutArticles;
}

export interface ColorCategory {
  hover: string;
  solid: string;
}
