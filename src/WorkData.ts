import { Urls } from "./Metadata";

export interface WorkData {
  id: number;

  title: string;
  url: string;

  author: string;
  author_url: string;

  description: string;

  file: Buffer;
  file_urls: Urls;
  file_name: string;

  footer: string;
}
