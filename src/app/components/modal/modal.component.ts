import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

export interface FeedbackDialogData {
  titulo: string;
  mensagem: string;
  tipo?: 'erro' | 'aviso' | 'info';
  botaoConfirmar?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeedbackDialogData,
  ) {}

  fechar() {
    this.dialogRef.close();
  }
}
