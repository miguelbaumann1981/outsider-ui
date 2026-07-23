import { Release } from '../enums';
import { ArticleAuthor } from './article-author.interface';

export interface ReleasesApi {
  total: number;
  releases: ReleaseObj[];
}

export interface ReleaseObj {
  month: string;
  year: number;
  release: Release;
  id: string;
  index: number;
  articles?: ArticleAuthor[];
}
