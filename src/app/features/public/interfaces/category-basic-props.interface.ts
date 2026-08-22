import { Release } from '../types';

export interface CategoryBasicProps {
  authorArticle: string;
  authorInfo?: string;
  authorQuote?: string;
  content: string;
  id: string;
  image: string;
  quote?: string;
  references: string;
  release: Release;
  slug: string;
  subtitle?: string;
  titleArticle: string;
  titleCategory: string;
}
