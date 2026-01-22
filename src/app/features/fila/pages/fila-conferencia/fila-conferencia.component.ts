import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-fila-conferencia',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './fila-conferencia.component.html',
  styleUrls: ['./fila-conferencia.component.scss'],
})
export class FilaConferenciaComponent {
  displayedColumns: string[] = ['pedido', 'cliente', 'status'];

  dataSource = [
    { pedido: '123', cliente: 'Empresa A', status: 'OK' },
    { pedido: '124', cliente: 'Empresa B', status: 'PENDENTE' },
  ];

  data = [];
}
