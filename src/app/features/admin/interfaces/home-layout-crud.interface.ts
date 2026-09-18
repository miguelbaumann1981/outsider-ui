import { FeaturesLayout } from '@/features/public/interfaces';
import { ReleaseCode } from '@/features/public/types';

export interface HomeLayoutCrud {
  releaseCode: ReleaseCode;
  isDraft: boolean;
  isPublished: boolean;
  features: FeaturesLayout[];
}
