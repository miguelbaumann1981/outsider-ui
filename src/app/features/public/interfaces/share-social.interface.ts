import { Article } from './articles-api.interface';

export interface ShareSocialItem {
  social: string;
  imgUrl: string;
  imgWidth: string;
  imgAlt: string;
  article?: Article;
}
