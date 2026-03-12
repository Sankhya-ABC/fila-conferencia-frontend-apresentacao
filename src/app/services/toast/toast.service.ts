import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../../shared/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  error(title: string, message: string) {
    this.snackBar.openFromComponent(ToastComponent, {
      duration: 5000,
      data: { title, message },
      panelClass: ['toast-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
