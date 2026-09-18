import { ReleaseCode } from '../types';

export interface ReleaseLocalStorage {
  code: ReleaseCode;
  isCurrent: boolean;
}
