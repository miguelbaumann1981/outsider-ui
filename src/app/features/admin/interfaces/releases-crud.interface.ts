import { ReleaseCode } from '@/features/public/types';

export interface ReleasesCrud {
  index: number;
  isDraft: boolean;
  isPublished: boolean;
  isCurrentRelease: boolean;
  month: string;
  name: string;
  releaseCode: ReleaseCode;
  year: number;
}
