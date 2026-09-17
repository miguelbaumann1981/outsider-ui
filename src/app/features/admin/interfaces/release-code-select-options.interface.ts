import { ArticleCategory, ReleaseCode } from '@/features/public/types';

export interface ReleaseCodeSelect {
  code?: ReleaseCode;
  category?: ArticleCategory;
  displayName: string;
  disabled: boolean;
}
