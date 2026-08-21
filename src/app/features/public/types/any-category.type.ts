import {
  CategoryEditorial,
  CategoryMicrostory,
  CategoryOpinion,
  CategoryOutsiders,
  CategoryPoetry,
  CategoryTales,
} from '../interfaces';

export type AnyCategory =
  | CategoryEditorial
  | CategoryMicrostory
  | CategoryOpinion
  | CategoryOutsiders
  | CategoryPoetry
  | CategoryTales;
