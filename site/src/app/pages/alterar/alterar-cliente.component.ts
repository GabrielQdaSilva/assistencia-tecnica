import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from '../../core/services/clientes.service';
import { Cliente } from '../../core/types/types';

@Component({
  selector: 'app-alterar-cliente',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-card form-card">
      <h2>Alterar Cliente</h2>
      <form>
        <div class="field">
          <label>Nome</label>
          <input [(ngModel)]="item.nome" name="nome" placeholder="Nome completo" />
        </div>
        <div class="field">
          <label>Email</label>
          <input [(ngModel)]="item.email" name="email" placeholder="email@exemplo.com" />
        </div>
        <div class="field">
          <label>Telefone</label>
          <input [(ngModel)]="item.telefone" name="telefone" placeholder="(11) 99999-9999" />
        </div>
        <div class="field">
          <label>Endereço</label>
          <input [(ngModel)]="item.endereco" name="endereco" placeholder="Rua, número, bairro" />
        </div>
        @if (erro) {
          <div class="erro-msg">{{ erro }}</div>
        }
        <button class="btn-primary btn-block" [disabled]="loading" (click)="salvar()">
          @if (loading) { Salvando... } @else { Salvar }
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
export class AlterarClienteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  item: Cliente = {} as Cliente;
  loading = false;
  erro = '';
  constructor(
    private service: ClientesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id')!;
    this.service.buscarPorId(idParam).pipe(takeUntil(this.destroy$)).subscribe({
      next: d => this.item = d,
      error: () => this.erro = 'Erro ao carregar dados do cliente.'
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  salvar() {
    this.loading = true;
    this.erro = '';
    this.service.editar(this.item).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.router.navigate(['/clientes'], { queryParams: { _t: Date.now() } }),
      error: () => { this.erro = 'Erro ao salvar.'; this.loading = false; }
    });
  }
}
