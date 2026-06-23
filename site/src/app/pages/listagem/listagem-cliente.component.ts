import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from '../../core/services/clientes.service';
import { Cliente } from '../../core/types/types';

@Component({
  selector: 'app-listagem-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-card">
      <div class="page-header">
        <h2>Clientes</h2>
        <a class="btn-primary" routerLink="/clientes/cadastrar">+ Novo Cliente</a>
      </div>

      @if (erro) {
        <div class="erro">
          <span>{{ erro }}</span>
          <button class="btn-rec" (click)="carregar()">Recarregar</button>
        </div>
      }

      @if (!erro) {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (c of lista; track c.id) {
              <tr>
                <td class="cell-id">{{ c.id }}</td>
                <td class="cell-nome">{{ c.nome }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.telefone }}</td>
                <td>{{ c.endereco }}</td>
                <td class="acoes">
                  <button class="btn-sm btn-editar" [routerLink]="['/clientes/alterar', c.id]">Editar</button>
                  <button class="btn-sm btn-excluir" (click)="excluir(c.id!)">Excluir</button>
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="6" class="vazio">Nenhum cliente cadastrado.</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 28px; box-shadow: var(--shadow); }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .page-header h2 { color: var(--text); font-size: 1.25rem; font-weight: 700; }
    .btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; background: var(--primary); color: #fff; font-size: .85rem; font-weight: 600; border-radius: 8px; text-decoration: none; transition: background .15s; }
    .btn-primary:hover { background: var(--primary-hover); color: #fff; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .88rem; }
    thead tr { background: rgba(59,130,246,.08); }
    th { color: var(--text-muted); font-weight: 600; font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; padding: 12px 14px; text-align: left; }
    td { padding: 12px 14px; color: var(--text); border-bottom: 1px solid var(--border); }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: var(--surface-hover); }
    .cell-id { color: var(--text-muted); font-size: .8rem; width: 50px; }
    .cell-nome { font-weight: 500; }
    .acoes { display: flex; gap: 6px; }
    .btn-sm { padding: 6px 14px; font-size: .78rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: all .15s; }
    .btn-editar { background: rgba(59,130,246,.12); color: var(--primary); }
    .btn-editar:hover { background: var(--primary); color: #fff; }
    .btn-excluir { background: rgba(239,68,68,.12); color: var(--danger); }
    .btn-excluir:hover { background: var(--danger); color: #fff; }
    .vazio { text-align: center; color: var(--text-muted); font-style: italic; padding: 40px 16px !important; }
    .erro { padding: 14px 18px; background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25); border-radius: 10px; color: var(--danger); font-size: .85rem; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .btn-rec { padding: 6px 14px; background: var(--danger); color: #fff; border: none; border-radius: 6px; font-size: .78rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .btn-rec:hover { background: var(--danger-hover); }
  `]
})
export class ListagemClienteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  lista: Cliente[] = [];
  erro = '';
  constructor(private service: ClientesService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.carregar();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(() => this.carregar());
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  carregar() {
    this.erro = '';
    this.service.listar().pipe(takeUntil(this.destroy$)).subscribe({
      next: d => { this.lista = d; this.cdr.detectChanges(); },
      error: () => { this.erro = 'Erro ao conectar ao servidor.'; this.cdr.detectChanges(); }
    });
  }
  excluir(id: number | string) {
    if (id) this.service.excluir(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.lista = this.lista.filter(c => c.id !== id); this.cdr.detectChanges(); },
      error: () => { this.erro = 'Erro ao excluir.'; this.cdr.detectChanges(); }
    });
  }
}
