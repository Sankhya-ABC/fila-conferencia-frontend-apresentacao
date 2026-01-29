import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export function apiInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  const apiReq = req.clone({
    url: `${environment.API_GATEWAY}/api${req.url}`,
    setHeaders: {
      'Content-Type': 'application/json',
    },
  });

  return next(apiReq).pipe(
    catchError((error) => {
      return throwError(() => error);
    }),
  );
}
