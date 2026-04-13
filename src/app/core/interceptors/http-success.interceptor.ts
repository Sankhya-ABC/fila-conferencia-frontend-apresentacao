import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastService } from '../../services/toast/toast.service';

@Injectable()
export class HttpSuccessInterceptor implements HttpInterceptor {
  constructor(private toast: ToastService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (!req.headers.get('x-show-success')) return;

        if (
          event instanceof HttpResponse &&
          (req.method === 'POST' || req.method === 'PUT')
        ) {
          const response = event.body;

          let title = response?.title || 'Sucesso';
          let message = response?.message || 'Operação realizada com sucesso';

          this.toast.open(title, message, 'success');
        }
      }),
    );
  }
}
