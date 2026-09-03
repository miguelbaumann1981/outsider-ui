export type ReleaseCode = string & { readonly __releaseCodeBrand: unique symbol };

export function isReleaseCode(value: string): value is ReleaseCode {
  return /^[A-Z]{3}[0-9]{3}$/.test(value);
}

export type Release = 'CURRENT' | ReleaseCode | '';
