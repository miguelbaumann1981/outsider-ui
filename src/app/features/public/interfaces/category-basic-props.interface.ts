import { Gender, Release } from '../types';

export interface CategoryBasicProps {
  authorArticle: string;
  authorInfo?: string;
  authorQuote?: string;
  content: string;
  gender: Gender;
  id: string;
  image: string;
  quote?: string;
  references: string;
  release: Release;
  slug: string;
  titleArticle: string;
  titleCategory: string;
}
