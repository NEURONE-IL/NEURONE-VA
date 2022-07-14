import { Chatbot } from './Chatbot';

export interface ChatOption{
    _id?: string,
    textOption: string;
    replyType: string;
    textReply?: string;
    filename?: string | String;
    optionsIn:ChatOption[];
  }
  