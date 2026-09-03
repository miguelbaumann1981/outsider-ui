export interface AboutUsCrud {
  mainText: string;
  collaborators: Collaborator[];
  release: string;
  isDraft: boolean;
  isPublished: boolean;
}

export interface Collaborator {
  name: string;
  text: string;
  picture: string;
}
