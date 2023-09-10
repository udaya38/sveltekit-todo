export interface IList {
  _id: string;
  task: string;
  isCompleted: boolean;
}

export interface IFile {
  name: string;
  url: string | ArrayBuffer | null;
  size: number;
  type: string;
  _id?: string;
}
