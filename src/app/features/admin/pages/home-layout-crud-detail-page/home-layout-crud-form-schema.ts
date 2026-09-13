import {
  applyEach,
  disabled,
  max,
  min,
  pattern,
  required,
  schema,
  SchemaPathTree,
} from '@angular/forms/signals';
import { HomeLayoutCrud } from '../../interfaces';
import { FeaturesLayout } from '@/features/public/interfaces';
import es from '@/i18n/es.json';

const hexadecimalColorPattern = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const i18n = es;

const featureSchemaBase = (feature: SchemaPathTree<FeaturesLayout>) => {
  disabled(feature.category);

  required(feature.position, { message: i18n.homeLayout.validations.positionRequired });
  min(feature.position, 1, { message: i18n.homeLayout.validations.positionMin });
  max(feature.position, 6, { message: i18n.homeLayout.validations.positionMax });

  required(feature.color.solid, { message: i18n.homeLayout.validations.colorSolidRequired });
  pattern(feature.color.solid, hexadecimalColorPattern, {
    message: i18n.homeLayout.validations.colorPattern,
  });

  required(feature.color.hover, { message: i18n.homeLayout.validations.colorHoverRequired });
  pattern(feature.color.hover, hexadecimalColorPattern, {
    message: i18n.homeLayout.validations.colorPattern,
  });
};

export const homeLayoutSchemaBase = schema<HomeLayoutCrud>((path) => {
  required(path.releaseCode, { message: i18n.homeLayout.validations.releaseCodeRequired });

  applyEach(path.features, featureSchemaBase);
});
