import { required, schema, SchemaPathTree } from '@angular/forms/signals';
import es from '@/i18n/es.json';
import { ArticleCrud } from '../../interfaces';

const i18n = es;

export const articleSchemaBase = schema<ArticleCrud>((path) => {
  required(path.authorArticle, { message: i18n.aboutUs.validations.mainTextRequired });
  required(path.category, { message: i18n.aboutUs.validations.mainTextRequired });
  required(path.content, { message: i18n.aboutUs.validations.mainTextRequired });
  required(path.image, { message: i18n.aboutUs.validations.mainTextRequired });
  required(path.releaseCode, { message: i18n.aboutUs.validations.releaseRequired });
  required(path.slug, { message: i18n.aboutUs.validations.mainTextRequired });
  required(path.titleArticle, { message: i18n.aboutUs.validations.mainTextRequired });
  required(path.titleCategory, { message: i18n.aboutUs.validations.mainTextRequired });
});
