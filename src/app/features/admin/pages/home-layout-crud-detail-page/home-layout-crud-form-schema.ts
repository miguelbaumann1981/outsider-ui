import {
  applyEach,
  disabled,
  pattern,
  required,
  schema,
  SchemaPathTree,
} from '@angular/forms/signals';
import { HomeLayoutCrud } from '../../interfaces';
import { FeaturesLayout } from '@/features/public/interfaces';

const hexadecimalColorPattern = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;

const featureSchemaBase = (feature: SchemaPathTree<FeaturesLayout>) => {
  disabled(feature.category);

  required(feature.position, { message: 'Mandatory' });

  required(feature.color.solid, { message: 'Mandatory' });
  pattern(feature.color.solid, hexadecimalColorPattern, {
    message: 'Invalid hexadecimal color',
  });

  required(feature.color.hover, { message: 'Mandatory' });
  pattern(feature.color.hover, hexadecimalColorPattern, {
    message: 'Invalid hexadecimal color',
  });
};

export const homeLayoutSchemaBase = schema<HomeLayoutCrud>((path) => {
  required(path.releaseCode, { message: 'Mandatory!' });

  applyEach(path.features, featureSchemaBase);
});
