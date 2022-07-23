import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'searchSong'})
export class SearchSongPipe implements PipeTransform {
    transform(songs: any[], searchTerm: string) {
        if (!searchTerm || searchTerm === '') {
            return songs;
        }
        const term = searchTerm.toLowerCase();
        return songs.filter(s => {
            const song = s.track.name.toLowerCase();
            const artist = s.track.artists[0].name.toLowerCase();
            return song.includes(searchTerm) || artist.includes(searchTerm);
        })
    }
}