import { Collection } from 'fireorm';

@Collection()
export default class Answer {
  id!: string;
  userID: string;
  userName: string;
  answer: string;
  createdAt: Date;
}
