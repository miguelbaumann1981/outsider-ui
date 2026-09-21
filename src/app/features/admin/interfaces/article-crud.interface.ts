import { ArticleCategory } from '@/features/public/enums';
import { ReleaseCode } from '@/features/public/types';

export interface ArticleCrud {
  authorArticle: string;
  category: ArticleCategory;
  content: string;
  image: string;
  releaseCode: ReleaseCode;
  slug: string;
  titleArticle: string;
  titleCategory: string;
  isDraft: boolean;
  isPublished: boolean;
  subtitle: string;
  references: string;
  authorQuote: string;
  authorInfo: string;
  quote: string;
}
