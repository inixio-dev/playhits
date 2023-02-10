import { RequestResult } from "../../pipes/requestResult.pipe";

export class RequestDto {
    id!: string;
    requestedAt!: Date;
    requester!: string;
    result!: RequestResult;
    song?: {
        artist: string;
        title: string;
    }
}