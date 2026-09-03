import { Release } from '../types';

export interface AboutUsApi {
  id: string;
  mainText: string;
  collaborators: Collaborator[];
  release: Release;
  isDraft: boolean;
  isPublished: boolean;
}

export interface Collaborator {
  name: string;
  text: string;
  picture: string;
}
