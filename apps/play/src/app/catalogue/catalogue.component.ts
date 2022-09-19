import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogueService } from './catalogue.service';

@Component({
  selector: 'playhits-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  constructor(private route: ActivatedRoute, private catalogueService: CatalogueService) {}

  hostId?: string| undefined;
  host?: any | undefined;
  songs?: any;
  searchTerm = '';
  loading = true;

  ngOnInit(): void {
    this.route.queryParams.subscribe((qp: any) => {
      this.hostId = qp.host;
      if (this.hostId) {
        this.catalogueService.getCatalogueFromHost(this.hostId).subscribe({
          next: (res) => {
            this.host = res;
            this.catalogueService.getSongsFromHost(this.host.id).subscribe({
              next: (res: any) => {
                this.songs = res;
                this.loading = false;
              }
            });
          }
        });
      }
    });
  }

  getSongsFromPlaylist(playlistId: string) {
    this.loading = true;
    this.catalogueService.getSongsFromPlaylist(this.host.id, playlistId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.songs = res.items;
      }
    });
  }

  addSongToQueue(songUrl: string) {
    this.loading = true;
    this.catalogueService.addSongToQueue(this.host.id, songUrl).subscribe({
      next: (res: any) => {
        alert(res.message)
      },
      error: (err) => {
        alert('Vaya... Parece que ha habido un error. Por favor, vuelve a intentarlo más adelante')
      },
      complete: () => {
        this.loading = false;
        this.searchTerm = '';
      }
    })
  }

  goBack() {
    this.songs = null;
    this.searchTerm = '';
  }

}
