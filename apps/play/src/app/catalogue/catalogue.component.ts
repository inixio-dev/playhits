/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
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
  showQR = true;
  appUrl = environment.appUrl;
  canShare = navigator.share !== undefined;

  ngOnInit(): void {
    this.route.queryParams.subscribe((qp) => {
      this.hostId = qp['host'];
      if (this.hostId) {
        this.catalogueService.getCatalogueFromHost(this.hostId).subscribe({
          next: (res) => {
            this.host = res;
            this.catalogueService.getSongsFromHost(this.host.id).subscribe({
              next: (res) => {
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
      error: () => {
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

  toggleQR() {
    this.showQR = true;
  }

  closeQR() {
    this.showQR = false;
  }

  async share() {
    if (this.canShare) {
      return await navigator.share({
        title: `PlayHits!`,
        text: `Pide tu canción favorita y haz que suene en el Spotify de ${this.host.name}`,
        url: `https://playhits.inixio.dev/catalogue?host=${this.hostId}`
      });
    } else {
      return await navigator.clipboard.writeText(`https://playhits.inixio.dev/catalogue?host=${this.hostId}`)
    }
  }


}
