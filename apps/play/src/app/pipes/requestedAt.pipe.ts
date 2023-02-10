import { Pipe, PipeTransform } from "@angular/core";
import { RequestDto } from "../host/dto/request.dto";

@Pipe({name: 'requestedAt'})
export class RequestedAtPipe implements PipeTransform {
    transform(requestedAt: Date) {
        const timeDiff = new Date().getTime() - new Date(requestedAt).getTime();
        const timeDiffInMins = Math.floor(timeDiff / (1000 * 60));
        if (timeDiffInMins === 0) {
            return `Hace ${Math.floor(timeDiff / 1000)} segundos`;
        }
        if (timeDiffInMins < 30) {
            return `Hace ${timeDiffInMins} minutos`;
        }
        return new Date(requestedAt).toLocaleString('es-ES');
    }
}