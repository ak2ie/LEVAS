import { Collection } from 'fireorm';

@Collection()
export default class User {
  id!: string;
  lineID: string;
  userID: string;
  userName: string;
  memo: string;
  createdAt: Date;
}
