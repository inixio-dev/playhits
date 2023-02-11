/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { SingleOrMultiDataSet } from 'ng2-charts';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { MyPlaylistsDto } from '../dtos/MyPlaylists.dto';
import { HostDto } from './dto/host.dto';
import { RequestDto } from './dto/request.dto';
import { HostsService } from './hosts.service';
import * as Highcharts from 'highcharts';
import { RequestResult } from '../pipes/requestResult.pipe';

@Component({
  selector: 'playhits-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent implements OnInit {

  host?: HostDto;
  myPlaylists?: MyPlaylistsDto;
  setOfCheckedId = new Set<string>();
  currentPage = 1;
  appUrl = environment.appUrl;
  requests: RequestDto[] = [];
  requestPageIndex = 1;
  Highcharts: typeof Highcharts = Highcharts;

  public barChartLegend = true;
  public barChartPlugins = [];

  days = Array(7).fill(new Date()).map((d: Date, i) => {
    const daysAgo = 1000*60*60*24*(6-i);
    return new Date(d.getTime() - daysAgo).toLocaleDateString('es'); 
  });
  chartOptions: Highcharts.Options = {};


  datasets: SingleOrMultiDataSet = 
    [[ 65, 59, 80, 81, 56, 55, 40 ], [ 28, 48, 40, 19, 86, 27, 90 ]];

  public barChartOptions: ChartConfiguration = {
    data: {
      labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
      datasets: [{label: ''}]
    },
    options: {
      responsive: false
    }
  };


  constructor(private hostService: HostsService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
  console.log('Days', this.days);
    this.hostService.getRequests().subscribe({
      next: (res) => {
        console.log('Requests', res);
        this.requests = res as RequestDto[];
        this.loadChart();
      }
    })
    this.hostService.getMyInfo().subscribe({
      next: (res: any) => {
        this.host = res;
        this.loadChart();
        this.host?.catalogues.forEach(c => this.setOfCheckedId.add(c.spotifyPlaylistId));
        this.route.queryParams.subscribe((qp) => {
          const {code} = qp;
          if (code) {
            this.authService.saveTokenFromCode(code).pipe(take(1)).subscribe({
              next: () => {
                window.location.reload();
              },
              error: () => {
                this.router.navigate(['host']);
              }
            });
          }
        });
        this.authService.getMyPlaylists(this.currentPage).subscribe({
          next: (res: any) => {
            this.myPlaylists = res;
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  authorizeSpotify() {
    this.authService.authorizeSpotify();
  }

  onItemChecked(id: string, selected: any) {
    let request;
    const playlist = this.myPlaylists?.items.find(p => p.id === id)
    if (selected) {
      request = this.hostService.addToCatalogue(playlist);
    } else {
      request = this.hostService.removeFromCatalogue(id);
    }
    request.pipe(take(1)).subscribe({
      next: () => {
        if (selected) {
          this.setOfCheckedId.add(id);
        } else {
          this.setOfCheckedId.delete(id);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.authService.getMyPlaylists(this.currentPage).subscribe({
      next: (res: any) => {
        this.myPlaylists = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  changeRequestsPage(newPage: number) {
    this.requestPageIndex = newPage;
    this.hostService.getRequests(this.currentPage - 1).subscribe({
      next: (res: any) => {
        this.requests = res as RequestDto[];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadDefaultCover(event: any) {
    event.target.src = 'assets/default-cover.png';
  }

  loadChart() {
    const byDay = this.requestsByDay();
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Peticiones diarias',
      },
      xAxis: {
        categories: this.days
      },
      yAxis: {
        title: {
          text: 'Peticiones'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
                Highcharts.defaultOptions?.title?.style &&
                Highcharts.defaultOptions?.title?.style.color
            ) || 'gray',
            textOutline: 'none'
          }
        },
      },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
      series: [
        {
          name: 'Cola llena',
          data: this.requestsByDay().map(day => day.filter(r => r.result === RequestResult.FULL_QUEUE).length),
          type: 'column',
          color: 'red'
        },
        {
          name: 'El cliente ha alcanzado su límite',
          data: byDay.map(day => day.filter(r => RequestResult.USER_LIMIT_REACHED === r.result).length),
          type: 'column',
          color: 'orange'
        },
        {
          name: 'Ya estaba en cola o ha sonado hace poco',
          data: byDay.map(day => day.filter(r => [RequestResult.ALREADY_IN_QUEUE, RequestResult.RECENTLY_PLAYED].includes(r.result)).length),
          type: 'column',
          color: '#FFCE44'
        },
        {
          name: 'Encoladas',
          data: byDay.map(day => day.filter(r => r.result === RequestResult.ADDED).length),
          type: 'column',
          color: 'green'
        },
      ]
    };
  }

  requestsByDay(): RequestDto[][] {
    const byDay: RequestDto[][] = [];
    this.days.forEach((day, i) => {
      byDay[i] = this.requests.filter(r => new Date(r.requestedAt).toLocaleDateString('es') === day);
    })
    return byDay;
  }
}
