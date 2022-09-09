import { Collection } from 'fireorm';
import Answer from './answer';

@Collection()
export default class Event {
  id!: string;
  eventID: string;
  eventName: string;
  message: string;
  leftButtonLabel: string;
  rightButtonLabel: string;
  createdAt: Date;
  answers: Array<Answer>;
}
