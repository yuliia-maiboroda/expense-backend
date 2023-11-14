import { TYPE_OF_CATEGORY } from '.';

export class DefaultCategory {
  id!: number;
  label!: string;
  type!: keyof typeof TYPE_OF_CATEGORY;
  ismutable!: boolean;
}

export class UserCategory {
  id!: number;
  label!: string;
  type!: keyof typeof TYPE_OF_CATEGORY;
  owner!: number;
  ismutable!: boolean;
}
