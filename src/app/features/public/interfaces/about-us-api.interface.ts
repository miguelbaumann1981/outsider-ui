export interface AboutUsApi {
  id: string;
  mainText: string;
  collaborators: Collaborator[];
}

export interface Collaborator {
  name: string;
  text: string;
  picture: string;
}
