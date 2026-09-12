import { ArticleCategory } from '../enums';
import { ReleaseCode } from '../types';

export interface HomeLayoutApi {
  id: string;
  releaseCode: ReleaseCode;
  isDraft: boolean;
  isPublished: boolean;
  features: FeaturesLayout[];
}

export interface FeaturesLayout {
  position: number;
  color: ColorFeature;
  category: ArticleCategory;
}

export interface ColorFeature {
  solid: string;
  hover: string;
}
