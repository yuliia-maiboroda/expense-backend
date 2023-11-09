import { TYPE_OF_CATEGORY } from './constants';

export interface ICategory {
  id: number;
  label: string;
  type: TYPE_OF_CATEGORY;
  owner: number | null;
}
