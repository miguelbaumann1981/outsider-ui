import { ReleaseCode, ReleaseMonth } from '../types';
import { ArticleAuthor } from './article-author.interface';

export interface ReleasesApi {
  id: string;
  index: number;
  isDraft: boolean;
  isPublished: boolean;
  isCurrentRelease: boolean;
  month: ReleaseMonth;
  name: string;
  releaseCode: ReleaseCode;
  year: number;
  articles?: ArticleAuthor[];
}
