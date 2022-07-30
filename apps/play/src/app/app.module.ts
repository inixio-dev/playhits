import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { HostComponent } from './host/host.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ApiAuthInterceptor } from './api-auth.interceptor';
import { QRCodeModule } from 'angularx-qrcode';
import { CatalogueService } from './catalogue/catalogue.service';
import {
  PlusCircleFill,
  QrcodeOutline
} from '@ant-design/icons-angular/icons';
import { SearchSongPipe } from './pipes/search.pipe';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
registerLocaleData(es);

const routes: Routes = [
  {
    path: 'catalogue',
    component: CatalogueComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'host',
    component: HostComponent
  },
  {
    path: '**',
    redirectTo: 'catalogue'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CatalogueComponent,
    HostComponent,
    LoginComponent,
    SearchSongPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzIconModule.forRoot([PlusCircleFill, QrcodeOutline]),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.cubeGrid
    }),
    QRCodeModule
  ],
  providers: [
    { 
      provide: NZ_I18N, 
      useValue: es_ES 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiAuthInterceptor,
      multi: true
    },
    CatalogueService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
