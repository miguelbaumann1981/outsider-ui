import { Release, ReleaseMonth } from '../types';
import { ArticleAuthor } from './article-author.interface';

export interface ReleasesApi {
  id: string;
  index: number;
  isDraft: boolean;
  isPublished: boolean;
  month: ReleaseMonth;
  name: string;
  release: Release;
  year: number;
  articles?: ArticleAuthor[];
}
