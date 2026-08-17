import { ArticleCategory } from '../enums';

export const getColorCategory = (section: ArticleCategory): string => {
  switch (section) {
    case ArticleCategory.POETRY:
      return 'bg-red-300';
    case ArticleCategory.EDITORIAL:
      return 'bg-blue-300';
    case ArticleCategory.MICROSTORY:
      return 'bg-green-300';
    case ArticleCategory.TALES:
      return 'bg-yellow-300';
    case ArticleCategory.OPINION:
      return 'bg-purple-300';
    case ArticleCategory.OUTSIDERS:
      return 'bg-pink-300';

    default:
      return section;
  }
};

export const getTextColorCategory = (section: ArticleCategory): string => {
  switch (section) {
    case ArticleCategory.POETRY:
      return 'text-red-300';
    case ArticleCategory.EDITORIAL:
      return 'text-blue-300';
    case ArticleCategory.MICROSTORY:
      return 'text-green-300';
    case ArticleCategory.TALES:
      return 'text-yellow-300';
    case ArticleCategory.OPINION:
      return 'text-purple-300';
    case ArticleCategory.OUTSIDERS:
      return 'text-pink-300';

    default:
      return section;
  }
};

export const getColorHoverCategory = (section: ArticleCategory): string => {
  switch (section) {
    case ArticleCategory.POETRY:
      return 'hover:bg-red-50';
    case ArticleCategory.EDITORIAL:
      return 'hover:bg-blue-50';
    case ArticleCategory.MICROSTORY:
      return 'hover:bg-green-50';
    case ArticleCategory.TALES:
      return 'hover:bg-yellow-50';
    case ArticleCategory.OPINION:
      return 'hover:bg-purple-50';
    case ArticleCategory.OUTSIDERS:
      return 'hover:bg-pink-50';

    default:
      return section;
  }
};
