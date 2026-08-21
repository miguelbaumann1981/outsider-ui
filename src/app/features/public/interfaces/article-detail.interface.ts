import { ArticleCategory, Release, Template } from '../types';

export interface ArticleDetail {
  category: ArticleCategory;
  release: Release;
  slug: string;
  template?: Template;
}
