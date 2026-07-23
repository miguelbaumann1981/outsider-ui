import { ArticleCategory } from '../enums';

export const getFontFamilyCategory = (section: ArticleCategory): string => {
  switch (section) {
    case ArticleCategory.BOOKSYEAR:
      return 'gravitas-one-regular';
    case ArticleCategory.EDITORIAL:
      return 'homemade-apple-regular ';
    case ArticleCategory.MICROSTORY:
      return 'special-elite-regular ';
    case ArticleCategory.TALES:
      return 'carter-one-regular ';
    case ArticleCategory.OPINION:
      return 'fredoka-regular ';
    case ArticleCategory.OUTSIDERS:
      return 'zen-dots-regular ';

    default:
      return '';
  }
};
