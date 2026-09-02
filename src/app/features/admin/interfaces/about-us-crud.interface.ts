export interface AboutUsCrud {
  mainText: string;
  collaborator: Collaborator;
  isDraft: boolean;
  isPublished: boolean;
}

export interface Collaborator {
  name: string;
  text: string;
  picture: string;
}
