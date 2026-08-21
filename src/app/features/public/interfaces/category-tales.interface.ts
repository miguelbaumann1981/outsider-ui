import { CategoryBasicProps } from '.';
import { ArticleCategory } from '../enums';

export interface CategoryTales extends CategoryBasicProps {
  authorInfo: string;
  authorQuote: string;
  category: ArticleCategory.TALES;
  quote: string;
}
