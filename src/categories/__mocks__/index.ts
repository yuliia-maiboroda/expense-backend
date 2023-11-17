import { UserCategory } from '../../models/categories';

export const mockedCategory: UserCategory = {
  id: 1,
  label: 'test',
  type: 'income',
  owner: 1,
  ismutable: true,
};

export const mockedCategories: UserCategory[] = [
  {
    id: 1,
    label: 'test',
    type: 'income',
    owner: 1,
    ismutable: true,
  },

  {
    id: 2,
    label: 'test2',
    type: 'income',
    owner: 1,
    ismutable: true,
  },
];
