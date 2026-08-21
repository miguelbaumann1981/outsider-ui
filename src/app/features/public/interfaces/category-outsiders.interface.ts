import { CategoryBasicProps } from '.';
import { ArticleCategory } from '../enums';

export interface CategoryOutsiders extends CategoryBasicProps {
  category: ArticleCategory.OUTSIDERS;
}
