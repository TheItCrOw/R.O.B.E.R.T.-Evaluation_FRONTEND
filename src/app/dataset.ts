import * as mongodb from "mongodb";

export interface Dataset {
    instruction?: string;
    output?: string;
    input?: string;
    context?: string;
    model?: string;
    type?: "instruction" | "dialog";
    rating?: number;
    comment?: string;
    isRated?: boolean;
    _id?: string;
}