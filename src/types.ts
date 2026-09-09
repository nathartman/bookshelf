export interface GoodreadsBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  pageCount: number | null;
  publishYear: number | null;
  readDate: string | null;
}

export type BookHeight =
  | number
  | {
      mobile: number;
      desktop: number;
    };

