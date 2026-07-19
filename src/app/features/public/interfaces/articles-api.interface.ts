import { ArticleCategory } from '../enums/article-category.enum';
import { Release } from '../enums/release.enum';

export interface ArticlesApi {
  total: number;
  articles: Article[];
}

export interface Article {
  title: string;
  subtitle: string;
  slug: string;
  category: ArticleCategory;
  author: string;
  image: string;
  createdAt: Date;
  release: Release;
  content: string;
  id: string;
}
