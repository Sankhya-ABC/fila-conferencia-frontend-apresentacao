import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './redefinir-senha.component.html',
})
export class RedefinirSenhaComponent implements OnInit {
  form!: FormGroup;
  token!: string;
  email!: string;

  loading = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];

      if (!this.token || !this.email) {
        this.router.navigate(['/erro']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { senha, confirmarSenha } = this.form.value;

    if (senha !== confirmarSenha) {
      this.erro = 'As senhas não coincidem';
      return;
    }

    this.loading = true;
    this.erro = '';

    this.http
      .post('/api/redefinir-senha', {
        senha,
        token: this.token,
        email: this.email,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
          this.router.navigate(['/erro']);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
