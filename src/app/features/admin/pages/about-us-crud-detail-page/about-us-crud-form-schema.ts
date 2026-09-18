import { applyEach, required, schema, SchemaPathTree } from '@angular/forms/signals';
import { AboutUsCrud, Collaborator } from '../../interfaces';
import es from '@/i18n/es.json';

const i18n = es;

const collaboratorsSchemaBase = (collaborator: SchemaPathTree<Collaborator>) => {
  required(collaborator.name, { message: i18n.aboutUs.validations.nameRequired });
  required(collaborator.text, { message: i18n.aboutUs.validations.textRequired });
  required(collaborator.picture, { message: i18n.aboutUs.validations.pictureRequired });
};

export const aboutUsSchemaBase = schema<AboutUsCrud>((path) => {
  required(path.releaseCode, { message: i18n.aboutUs.validations.releaseRequired });
  required(path.mainText, { message: i18n.aboutUs.validations.mainTextRequired });
  applyEach(path.collaborators, collaboratorsSchemaBase);
});
