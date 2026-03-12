import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;

  private loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable();

  start() {
    this.loadingCount++;

    if (this.loadingCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  stop() {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }

    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
    }
  }
}
