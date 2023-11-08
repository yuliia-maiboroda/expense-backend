import { ICategory } from '../categories';

export interface ITransaction {
  id: number;
  label: string;
  amount: number;
  date: Date;
  category: ICategory;
  owner: number;
}
