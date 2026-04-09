import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-erro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './erro.component.html',
})
export class ErroComponent {
  constructor(private router: Router) {}

  voltar() {
    this.router.navigate(['/']);
  }
}
