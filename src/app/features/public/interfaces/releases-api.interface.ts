import { Release } from '../enums';
import { ReleaseMonth } from '../types';
import { ArticleAuthor } from './article-author.interface';

export interface ReleasesApi {
  total: number;
  releases: ReleaseObj[];
}

export interface ReleaseObj {
  month: ReleaseMonth;
  year: number;
  release: Release;
  id: string;
  index: number;
  articles?: ArticleAuthor[];
}
