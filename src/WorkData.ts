export interface WorkData {
  id: number;

  title: string;
  url: string;

  author: string;
  author_url: string;

  description: string;

  file: Buffer;
  file_url: string;
  file_name: string;
}
