import { pattern, required, schema, SchemaPathTree } from '@angular/forms/signals';
import es from '@/i18n/es.json';
import { ArticleCrud } from '../../interfaces';

const i18n = es;

export const articleSchemaBase = schema<ArticleCrud>((path) => {
  required(path.releaseCode, { message: i18n.articles.validations.releaseCodeRequired });
  required(path.category, { message: i18n.articles.validations.categoryRequired });
  required(path.authorArticle, { message: i18n.articles.validations.authorArticleRequired });
  required(path.content, { message: i18n.articles.validations.contentRequired });
  required(path.image, { message: i18n.articles.validations.imageRequired });
  required(path.slug, { message: i18n.articles.validations.slugRequired });
  pattern(path.slug, /^\S*$/, { message: i18n.articles.validations.slugPattern });
  required(path.titleArticle, { message: i18n.articles.validations.titleArticleRequired });
  required(path.titleCategory, { message: i18n.articles.validations.titleCategoryRequired });
});
