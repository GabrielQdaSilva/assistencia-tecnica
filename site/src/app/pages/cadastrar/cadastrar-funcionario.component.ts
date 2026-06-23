import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuncionariosService } from '../../core/services/funcionarios.service';
import { Funcionario } from '../../core/types/types';

@Component({
  selector: 'app-cadastrar-funcionario',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-card form-card">
      <h2>Cadastrar Funcionário</h2>
      <form>
        <div class="field">
          <label>Nome</label>
          <input [(ngModel)]="item.nome" name="nome" placeholder="Nome completo" required />
        </div>
        <div class="field">
          <label>Cargo</label>
          <input [(ngModel)]="item.cargo" name="cargo" placeholder="Ex: Técnico" required />
        </div>
        <div class="field">
          <label>Telefone</label>
          <input [(ngModel)]="item.telefone" name="telefone" placeholder="(11) 99999-9999" type="tel" />
        </div>
        <div class="field">
          <label>Email</label>
          <input [(ngModel)]="item.email" name="email" placeholder="email@exemplo.com" type="email" />
        </div>
        @if (erro) {
          <div class="erro-msg">{{ erro }}</div>
        }
        <button class="btn-primary btn-block" [disabled]="loading" (click)="submeter()">
          @if (loading) { Salvando... } @else { Cadastrar }
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-card { max-width: 480px; margin: 0 auto; }
    h2 { color: var(--text); font-size: 1.25rem; font-weight: 700; margin-bottom: 28px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; margin-bottom: 6px; font-size: .82rem; font-weight: 600; color: var(--text-muted); }
    .field input { width: 100%; padding: 10px 14px; font-size: .9rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); transition: all .15s; }
    .field input::placeholder { color: var(--text-muted); opacity: .6; }
    .field input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
    .btn-block { width: 100%; justify-content: center; padding: 11px; margin-top: 8px; font-size: .9rem; }
    .btn-block:disabled { opacity: .5; cursor: not-allowed; }
    .erro-msg { color: var(--danger); font-size: .85rem; margin-bottom: 16px; padding: 10px 14px; background: rgba(239,68,68,.1); border-radius: 8px; text-align: center; }
  `]
})
export class CadastrarFuncionarioComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  item: Funcionario = {} as Funcionario;
  loading = false;
  erro = '';
  constructor(private service: FuncionariosService, private router: Router) {}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  submeter() {
    if (!this.item.nome || !this.item.cargo) { this.erro = 'Nome e Cargo são obrigatórios.'; return; }
    if (this.item.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.item.email)) { this.erro = 'Email inválido.'; return; }
    this.loading = true;
    this.erro = '';
    this.service.incluir(this.item).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.router.navigate(['/funcionarios'], { queryParams: { _t: Date.now() } }),
      error: () => { this.erro = 'Erro ao cadastrar. Verifique a conexão.'; this.loading = false; }
    });
  }
}
