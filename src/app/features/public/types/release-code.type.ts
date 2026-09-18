export type ReleaseAcronym = string & { readonly __releaseCodeBrand: unique symbol };

export function isReleaseCode(value: string): value is ReleaseAcronym {
  return /^[A-Z]{3}[0-9]{3}$/.test(value);
}

export type ReleaseCode = ReleaseAcronym | '';
