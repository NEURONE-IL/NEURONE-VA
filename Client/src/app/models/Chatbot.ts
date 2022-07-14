import {ChatOption} from "./ChatOption";

export interface Chatbot{
    message: string,
    optionList: ChatOption[],
}