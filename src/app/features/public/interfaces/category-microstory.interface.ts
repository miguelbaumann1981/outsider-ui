import { CategoryBasicProps } from '.';
import { ArticleCategory } from '../enums';

export interface CategoryMicrostory extends CategoryBasicProps {
  authorInfo: string;
  category: ArticleCategory.MICROSTORY;
  subtitle: string;
}
