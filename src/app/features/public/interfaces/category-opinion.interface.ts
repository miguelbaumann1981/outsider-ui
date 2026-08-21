import { CategoryBasicProps } from '.';
import { ArticleCategory } from '../enums';

export interface CategoryOpinion extends CategoryBasicProps {
  authorInfo: string;
  category: ArticleCategory.OPINION;
}
