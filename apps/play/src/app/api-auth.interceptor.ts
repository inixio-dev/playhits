import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const jwt = this.authService.getJWT();
    if (!jwt && this.needsLogin()) {
      this.router.navigate(['login']);
      return next.handle(request);
    }
    const clonedRequest = request.clone({ headers: request.headers.append('Authorization', `Bearer ${jwt}`) });
    return next.handle(clonedRequest);
  }

  needsLogin() {
    const currentRoute = this.router.url;
    console.log(currentRoute);
    return currentRoute === '/host';
  }
}
