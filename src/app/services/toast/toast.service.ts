import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  open(title: string, message: string, type: 'success' | 'error') {
    this.snackBar.openFromComponent(ToastComponent, {
      duration: 50000,
      data: { title, message },
      panelClass: [`toast-${type}`],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
