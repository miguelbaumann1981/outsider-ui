import { ArticleCategory } from '../enums/article-category.enum';

export interface ArticleCard {
  section: ArticleCategory;
  title: string;
  author: string;
  id: string;
  imageUrl: string;
  imageLayout: ImageLayout;
}

type ImageLayout = 'right' | 'left';
