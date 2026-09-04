import { Release, ReleaseMonth } from '../types';
import { ArticleAuthor } from './article-author.interface';

export interface ReleasesApi {
  articles?: ArticleAuthor[];
  id: string;
  index: number;
  month: ReleaseMonth;
  name: string;
  release: Release;
  year: number;
  isDraft: boolean;
  isPublished: boolean;
}
