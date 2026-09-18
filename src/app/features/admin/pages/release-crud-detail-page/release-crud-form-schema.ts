import { required, schema, maxLength, minLength, pattern, min, max } from '@angular/forms/signals';
import { ReleasesCrud } from '../../interfaces';
import es from '@/i18n/es.json';

const i18n = es;
const minCharactersName = 3;
const maxCharactersName = 30;
const monthPattern = new RegExp(`^(?:'1|2|3|4|5|6|7|8|9|10|11|12|')$`);

export const releaseSchemaBase = schema<ReleasesCrud>((path) => {
  required(path.name, { message: i18n.releases.validations.nameRequired });
  minLength(path.name, minCharactersName, {
    message: `${i18n.releases.validations.nameMinLength} ${minCharactersName}`,
  });
  maxLength(path.name, maxCharactersName, {
    message: `${i18n.releases.validations.nameMaxLength} ${maxCharactersName}`,
  });

  required(path.releaseCode, { message: i18n.releases.validations.releaseRequired });
  pattern(path.releaseCode, /^[A-Z]{3}[0-9]{3}$/, {
    message: i18n.releases.validations.releasePattern,
  });

  required(path.month, { message: i18n.releases.validations.monthRequired });
  pattern(path.month, monthPattern, {
    message: i18n.releases.validations.monthPattern,
  });
  maxLength(path.month, 2, {
    message: `${i18n.releases.validations.monthMaxLength} 2`,
  });

  required(path.year, { message: i18n.releases.validations.yearRequired });
  min(path.year, 2026, {
    message: `${i18n.releases.validations.yearMax}`,
  });
  max(path.year, 9999, {
    message: `${i18n.releases.validations.yearMax}`,
  });
});
