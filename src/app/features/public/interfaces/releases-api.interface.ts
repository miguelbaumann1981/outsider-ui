import { Release } from '../enums';

export interface ReleasesApi {
  total: number;
  releases: ReleaseObj[];
}

export interface ReleaseObj {
  month: string;
  year: number;
  release: Release;
  id: string;
}
