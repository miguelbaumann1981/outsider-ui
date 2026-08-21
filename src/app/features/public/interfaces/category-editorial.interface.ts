import { CategoryBasicProps } from '.';
import { ArticleCategory } from '../enums';

export interface CategoryEditorial extends CategoryBasicProps {
  category: ArticleCategory.EDITORIAL;
}
