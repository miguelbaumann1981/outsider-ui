import { Release } from '../enums';
import { ReleaseMonth } from '../types';
import { ArticleAuthor } from './article-author.interface';

export interface ReleasesApi {
  total: number;
  releases: ReleaseObj[];
}

export interface ReleaseObj {
  articles?: ArticleAuthor[];
  id: string;
  index: number;
  month: ReleaseMonth;
  name: string;
  release: Release;
  year: number;
}
