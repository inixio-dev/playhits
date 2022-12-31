import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'searchSong'})
export class SearchSongPipe implements PipeTransform {
    transform(songs: any[], searchTerm: string) {
        if (!searchTerm || searchTerm === '') {
            return songs;
        }
        const term = searchTerm.toLowerCase();
        return songs.filter(s => {
            const song = s.title.toLowerCase();
            const artist = s.artist.toLowerCase();
            return song.includes(term) || artist.includes(term);
        })
    }
}