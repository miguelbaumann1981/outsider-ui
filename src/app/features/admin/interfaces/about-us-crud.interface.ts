export interface AboutUsCrud {
  mainText: string;
  collaborators: Collaborator[];
  isDraft: boolean;
  isPublished: boolean;
}

export interface Collaborator {
  name: string;
  text: string;
  picture: string;
}
