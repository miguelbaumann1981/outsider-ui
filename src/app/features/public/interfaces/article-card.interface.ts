import { ArticleCategory } from '../enums';
import { ReleaseCode } from '../types';

export interface ArticleCard {
  author: string;
  color: string;
  hoverColor: string;
  id: string;
  imageUrl: string;
  name: string;
  position: number;
  releaseCode: ReleaseCode;
  category: ArticleCategory;
  slug: string;
  title: string;
}
