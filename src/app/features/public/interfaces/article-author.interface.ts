import { ArticleCategory } from '../types';

export interface ArticleAuthor {
  title: string;
  slug: string;
  author: string;
  category: ArticleCategory;
}
