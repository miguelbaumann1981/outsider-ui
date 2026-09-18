import { ReleaseCode } from '@/features/public/types';

export interface AboutUsCrud {
  mainText: string;
  collaborators: Collaborator[];
  releaseCode: ReleaseCode;
  isDraft: boolean;
  isPublished: boolean;
}

export interface Collaborator {
  name: string;
  text: string;
  picture: string;
}
