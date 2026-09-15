import { ReleaseCode } from '@/features/public/types';

export interface ReleaseCodeSelect {
  code: ReleaseCode;
  displayName: string;
  disabled: boolean;
}
