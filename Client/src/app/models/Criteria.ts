import { Criterion } from "./Criterion";

export interface Criteria{
    _id?: String,
    name: string,
    assistant: string,
    action?: string,
    criteria: Criterion[],
}