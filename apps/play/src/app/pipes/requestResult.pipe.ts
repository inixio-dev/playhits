import { Pipe, PipeTransform } from "@angular/core";
import { RequestDto } from "../host/dto/request.dto";

export enum RequestResult {
    ADDED = 'ADDED',
    ALREADY_IN_QUEUE = 'ALREADY_IN_QUEUE',
    FULL_QUEUE = 'FULL_QUEUE',
    USER_LIMIT_REACHED = 'USER_LIMIT_REACHED',
    RECENTLY_PLAYED = 'RECENTLY_PLAYED'
}

@Pipe({name: 'requestResult'})
export class RequestResultPipe implements PipeTransform {
    transform(requestResult: RequestResult) {
        switch(requestResult) {
            case RequestResult.ADDED:
                return 'Añadida a la cola';
            case RequestResult.ALREADY_IN_QUEUE:
                return 'Ya está en cola';
            case RequestResult.USER_LIMIT_REACHED:
                return 'El cliente ha alcanzado su límite';
            case RequestResult.RECENTLY_PLAYED:
                return 'La canción ha sonado hace poco';
            case RequestResult.FULL_QUEUE:
                return 'La cola está llena';
            default:
                return 'Desconocido';
        } 
    }
}