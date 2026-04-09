import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class RedefinirSenhaComponent implements OnInit {
  form!: FormGroup;

  token!: string;
  email!: string;

  loading = false;
  erro = '';
  erroSenha = false;

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
      this.erroSenha = true;
      return;
    }

    this.erroSenha = false;
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
