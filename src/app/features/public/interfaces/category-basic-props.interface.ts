import { ReleaseCode } from '../types';

export interface CategoryBasicProps {
  authorArticle: string;
  authorInfo?: string;
  authorQuote?: string;
  content: string;
  id: string;
  image: string;
  quote?: string;
  references: string;
  releaseCode: ReleaseCode;
  slug: string;
  subtitle?: string;
  titleArticle: string;
  titleCategory: string;
}
