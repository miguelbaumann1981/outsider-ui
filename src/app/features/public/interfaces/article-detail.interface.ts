import { ArticleCategory, ReleaseCode } from '../types';

export interface ArticleDetail {
  category: ArticleCategory;
  releaseCode: ReleaseCode;
  slug: string;
}
