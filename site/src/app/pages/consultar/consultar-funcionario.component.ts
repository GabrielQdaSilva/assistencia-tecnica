import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FuncionariosService } from '../../core/services/funcionarios.service';
import { Funcionario } from '../../core/types/types';

@Component({
  selector: 'app-consultar-funcionario',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-card form-card">
      <h2>Consultar Funcionário</h2>
      <form (ngSubmit)="buscar()" class="consulta-form">
        <div class="field">
          <label>ID do Funcionário</label>
          <input type="number" [(ngModel)]="idBusca" name="idBusca" placeholder="Digite o ID" required />
        </div>
        <button type="submit" class="btn-primary btn-block" [disabled]="loading">Buscar</button>
      </form>
      @if (loading) {
        <div class="loading-msg">Buscando...</div>
      }
      @if (encontrado) {
        <div class="result-card">
          <h3>Dados do Funcionário</h3>
          <div class="result-grid">
            <div class="result-item"><span class="result-label">ID</span><span class="result-value">{{ encontrado.id }}</span></div>
            <div class="result-item"><span class="result-label">Nome</span><span class="result-value">{{ encontrado.nome }}</span></div>
            <div class="result-item"><span class="result-label">Cargo</span><span class="result-value">{{ encontrado.cargo }}</span></div>
            <div class="result-item"><span class="result-label">Telefone</span><span class="result-value">{{ encontrado.telefone }}</span></div>
            <div class="result-item"><span class="result-label">Email</span><span class="result-value">{{ encontrado.email }}</span></div>
          </div>
        </div>
      }
      @if (erro) {
        <div class="consulta-erro">{{ erro }}</div>
      }
    </div>
  `,
  styles: [`
    .form-card { max-width: 480px; margin: 0 auto; }
    h2 { color: var(--text); font-size: 1.25rem; font-weight: 700; margin-bottom: 28px; }
    .consulta-form .field { margin-bottom: 20px; }
    .consulta-form .field label { display: block; margin-bottom: 6px; font-size: .82rem; font-weight: 600; color: var(--text-muted); }
    .consulta-form .field input { width: 100%; padding: 10px 14px; font-size: .9rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); transition: all .15s; }
    .consulta-form .field input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
    .btn-block { width: 100%; justify-content: center; padding: 11px; font-size: .9rem; }
    .btn-block:disabled { opacity: .5; cursor: not-allowed; }
    .result-card { margin-top: 28px; padding: 22px; background: rgba(59,130,246,.06); border: 1px solid rgba(59,130,246,.15); border-radius: 10px; }
    .result-card h3 { color: var(--text); font-size: 1rem; font-weight: 700; margin-bottom: 18px; }
    .result-grid { display: grid; gap: 12px; }
    .result-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border); }
    .result-item:last-child { border-bottom: none; }
    .result-label { color: var(--text-muted); font-size: .82rem; }
    .result-value { color: var(--text); font-size: .88rem; font-weight: 500; }
    .consulta-erro { margin-top: 24px; padding: 14px; background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25); border-radius: 10px; color: var(--danger); font-size: .85rem; text-align: center; }
    .loading-msg { margin-top: 24px; padding: 14px; background: rgba(59,130,246,.08); border-radius: 10px; color: var(--text-muted); font-size: .85rem; text-align: center; }
  `]
})
export class ConsultarFuncionarioComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  idBusca?: number;
  encontrado?: Funcionario;
  erro = '';
  loading = false;
  constructor(private service: FuncionariosService, private cdr: ChangeDetectorRef) {}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  buscar() {
    if (!this.idBusca) return;
    this.erro = '';
    this.encontrado = undefined;
    this.loading = true;
    this.service.buscarPorId(this.idBusca).pipe(takeUntil(this.destroy$)).subscribe({
      next: d => { this.encontrado = d; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.erro = 'Funcionário não encontrado.'; this.loading = false; this.cdr.detectChanges(); }
    });
  }
}
