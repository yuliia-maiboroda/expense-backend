import { Transaction } from '../../models/transactions';

export const mockedTransactions: Transaction[] = [
  {
    id: 1,
    amount: 100,
    label: 'test',
    category: 1,
    owner: 1,
    date: new Date(),
  },
  {
    id: 2,
    amount: -100,
    label: 'test2',
    category: 1,
    owner: 1,
    date: new Date(),
  },
];

export const mockedTransaction: Transaction = {
  id: 1,
  amount: 100,
  label: 'test',
  category: 1,
  owner: 1,
  date: new Date(),
};
