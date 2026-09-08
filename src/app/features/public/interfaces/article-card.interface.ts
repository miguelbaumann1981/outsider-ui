import { ArticleCategory } from '../enums';
import { PositionLayoutArticles, ReleaseCode } from '../types';

export interface ArticleCard {
  author: string;
  color: string;
  hoverColor: string;
  id: string;
  imageUrl: string;
  name: string;
  position: PositionLayoutArticles;
  releaseCode: ReleaseCode;
  section: ArticleCategory;
  slug: string;
  title: string;
}
