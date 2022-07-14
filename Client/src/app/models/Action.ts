import { Chatbot } from "./Chatbot";
import { Message } from "./Message";


export interface Action {
    _id?: String,
    name:String,
    assistant: String,
    type: String,
    chatbot?: Chatbot,
    message?: Message,
  }