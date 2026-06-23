import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FuncionariosService } from '../../core/services/funcionarios.service';
import { Funcionario } from '../../core/types/types';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-funcionarios-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="crud-bar">
      <button class="btn-primary" (click)="showForm = !showForm">
        {{ showForm ? 'Cancelar' : '+ Novo Funcionário' }}
      </button>
    </div>

    @if (showForm) {
      <div class="form-card">
        <h3>{{ editId ? 'Editar Funcionário' : 'Novo Funcionário' }}</h3>
        <div class="form-grid">
          <input [(ngModel)]="form.nome" placeholder="Nome" class="inp"/>
          <input [(ngModel)]="form.cargo" placeholder="Cargo" class="inp"/>
          <input [(ngModel)]="form.telefone" placeholder="Telefone" class="inp"/>
          <input [(ngModel)]="form.email" placeholder="Email" class="inp"/>
          <input [(ngModel)]="form.salario" type="number" placeholder="Salário (R$)" class="inp"/>
          @if (!editId) {
            <input [(ngModel)]="form.senha" type="password" placeholder="Senha (admin)" class="inp"/>
          }
        </div>
        <button class="btn-primary" [disabled]="loading" (click)="salvar()">
          @if (loading) { Salvando... } @else { Salvar }
        </button>
        @if (erroGeral) {
          <p class="err">{{ erroGeral }}</p>
        }
      </div>
    }

    <div class="consult-card">
      <h3>Consultar</h3>
      <div class="scope-buttons">
        <button class="scope-btn" [class.active]="campo === 'id'" (click)="campo='id'">ID</button>
        <button class="scope-btn" [class.active]="campo === 'nome'" (click)="campo='nome'">Nome</button>
        <button class="scope-btn" [class.active]="campo === 'cargo'" (click)="campo='cargo'">Cargo</button>
        <button class="scope-btn" [class.active]="campo === 'email'" (click)="campo='email'">Email</button>
        <button class="scope-btn" [class.active]="campo === 'telefone'" (click)="campo='telefone'">Telefone</button>
      </div>
      <div class="consult-row">
        <input [(ngModel)]="valor" (input)="consultar()" [placeholder]="'Buscar por ' + campo" class="inp"/>
      </div>
      @if (resultados.length > 0) {
        <div class="consult-result">
          <p class="consult-count">{{ resultados.length }} resultado(s)</p>
          @for (r of resultados; track r.id) {
            <div class="consult-item">
              <p><strong>ID:</strong> {{ r.id }}</p>
              <p><strong>Nome:</strong> {{ r.nome }}</p>
              <p><strong>Cargo:</strong> {{ r.cargo }}</p>
              <p><strong>Telefone:</strong> {{ r.telefone }}</p>
              <p><strong>Email:</strong> {{ r.email }}</p>
              <p><strong>Salário:</strong> {{ r.salario ? 'R$ ' + r.salario.toFixed(2) : '-' }}</p>
            </div>
          }
        </div>
      }
      @if (erro) {
        <p class="err">{{ erro }}</p>
      }
    </div>

    <div class="table-wrapper">
      @if (listLoading) {
        <p class="empty">Carregando...</p>
      } @else if (itens.length === 0) {
        <p class="empty">Nenhum funcionário cadastrado.</p>
      } @else {
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Cargo</th><th>Telefone</th><th>Email</th><th>Salário</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (f of itens; track f.id) {
              <tr>
                <td>{{ f.id }}</td>
                <td>{{ f.nome }}</td>
                <td>{{ f.cargo }}</td>
                <td>{{ f.telefone }}</td>
                <td>{{ f.email }}</td>
                <td>{{ f.salario ? 'R$ ' + f.salario.toFixed(2) : '-' }}</td>
                <td class="actions">
                  <button class="btn-sm btn-blue" (click)="editar(f)">Editar</button>
                  <button class="btn-sm btn-red" (click)="confirmExcluir(f)">Excluir</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>

    <app-confirm-dialog
      [show]="confirm.show"
      [title]="confirm.title"
      [text]="confirm.text"
      [loading]="confirm.loading"
      (confirmar)="confirmOk()"
      (cancelar)="confirmCancel()"
    />

    @if (sucesso) {
      <p class="success">{{ sucesso }}</p>
    }
    @if (!showForm && erroGeral) {
      <p class="err">{{ erroGeral }}</p>
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 24px; }
    .crud-bar { display: flex; gap: 8px; }
    .form-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 24px;
      border-left: 3px solid var(--primary);
    }
    .form-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: var(--text); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; margin-bottom: 16px; }
    .consult-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 24px;
      border-left: 3px solid rgba(59,130,246,.4);
    }
    .consult-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: var(--text); }
    .scope-buttons { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
    .scope-btn {
      padding: 7px 18px; font-size: .8rem; font-weight: 600;
      background: var(--surface-hover); color: var(--text-muted);
      border: 1px solid var(--border); border-radius: 20px;
      cursor: pointer; transition: all .2s;
    }
    .scope-btn:hover { color: var(--text); border-color: var(--text-muted); }
    .scope-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
    .consult-row { display: flex; gap: 10px; align-items: center; }
    .consult-result {
      margin-top: 14px; background: var(--surface-hover);
      border-radius: 8px; padding: 16px 20px;
      border: 1px solid var(--border);
    }
    .consult-result p { margin-bottom: 6px; font-size: .9rem; }
    .consult-count { font-size: .8rem !important; color: var(--text-muted); margin-bottom: 12px !important; }
    .consult-item {
      padding: 12px 0; border-top: 1px solid var(--border);
    }
    .consult-item:first-child { border-top: none; }
    .table-wrapper {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th, td { padding: 12px 16px; text-align: left; font-size: .85rem; }
    th {
      background: var(--surface-hover); font-weight: 600;
      color: var(--text-muted); text-transform: uppercase;
      font-size: .7rem; letter-spacing: .6px;
      border-bottom: 1px solid var(--border); white-space: nowrap;
    }
    td { color: var(--text); border-bottom: 1px solid var(--border); }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover td { background: rgba(59,130,246,.03); }
    td.actions { white-space: nowrap; }
    td.actions .btn-sm + .btn-sm { margin-left: 6px; }
    .empty { padding: 48px; text-align: center; color: var(--text-muted); }
    .inp {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; padding: 11px 16px;
      color: var(--text); font-size: .9rem;
      outline: none; transition: all .2s; width: 100%;
    }
    .inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; background: var(--primary); color: #fff;
      border: none; border-radius: 8px; font-size: .9rem; font-weight: 600;
      cursor: pointer; transition: all .2s; white-space: nowrap;
    }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
    .btn-sm { padding: 7px 16px; font-size: .8rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: all .2s; }
    .btn-blue { background: var(--primary); color: #fff; }
    .btn-blue:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-red { background: var(--danger); color: #fff; }
    .btn-red:hover { background: var(--danger-hover); transform: translateY(-1px); }
    .err { color: var(--danger); font-size: .9rem; padding: 10px 0; display: flex; align-items: center; gap: 6px; }
    .err::before { content: '⚠'; }
    .success {
      color: var(--success); font-size: .9rem; padding: 10px 16px; font-weight: 500;
      background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.15);
      border-radius: 8px; display: flex; align-items: center; gap: 6px;
    }
    .success::before { content: '✓'; font-weight: 700; }
  `]
})
export class FuncionariosCrudComponent implements OnInit {
  constructor(private service: FuncionariosService, private cdr: ChangeDetectorRef) {}

  itens: Funcionario[] = [];
  showForm = false;
  editId: number | null = null;
  form: Partial<Funcionario> = {};
  loading = false;
  listLoading = false;
  campo = 'id';
  valor = '';
  resultados: Funcionario[] = [];
  erro = '';
  sucesso = '';
  erroGeral = '';

  private destroy$ = new Subject<void>();
  confirm = { show: false, title: '', text: '', loading: false, item: null as Funcionario | null };

  ngOnInit() { this.listar(); }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private maskTel(v: string): string {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }

  listar() {
    this.listLoading = true;
    this.service.listar().pipe(takeUntil(this.destroy$)).subscribe({
      next: d => { this.itens = d; this.listLoading = false; this.cdr.detectChanges(); },
      error: () => { this.erroGeral = 'Erro ao carregar.'; this.listLoading = false; this.cdr.detectChanges(); }
    });
  }

  salvar() {
    if (!this.form.nome || !this.form.cargo) {
      this.erroGeral = 'Nome e Cargo são obrigatórios.';
      return;
    }
    if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.erroGeral = 'Email inválido.';
      return;
    }
    if (this.form.salario && this.form.salario < 0) {
      this.erroGeral = 'Salário não pode ser negativo.';
      return;
    }
    const dup = this.itens.find(f =>
      f.id !== this.editId && (
        f.nome.toLowerCase() === this.form.nome?.toLowerCase() ||
        (this.form.email && f.email.toLowerCase() === this.form.email.toLowerCase()) ||
        (this.form.telefone && f.telefone === this.form.telefone)
      )
    );
    if (dup) {
      this.erroGeral = 'Já existe um funcionário com este nome, email ou telefone.';
      return;
    }

    this.loading = true;
    this.erroGeral = '';
    const editando = !!this.editId;
    const op = editando
      ? this.service.editar({ ...this.form as Funcionario, id: this.editId! })
      : this.service.incluir(this.form as Funcionario);

    op.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading = false;
        this.showForm = false;
        this.editId = null;
        this.form = {};
        this.sucesso = editando ? 'Funcionário atualizado.' : 'Funcionário cadastrado.';
        this.cdr.detectChanges();
        setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000);
        this.listar();
      },
      error: () => { this.erroGeral = 'Erro ao salvar.'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  editar(f: Funcionario) {
    this.editId = f.id ?? null;
    this.form = { ...f, senha: undefined };
    this.showForm = true;
  }

  confirmExcluir(f: Funcionario) {
    this.confirm = { show: true, title: 'Excluir Funcionário', text: `Excluir "${f.nome}"? Esta ação não pode ser desfeita.`, loading: false, item: f };
  }
  confirmOk() {
    const f = this.confirm.item; if (!f?.id) return; this.confirm.loading = true;
    this.service.excluir(f.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.confirm = { show: false, title: '', text: '', loading: false, item: null }; this.sucesso = 'Funcionário excluído.'; this.cdr.detectChanges(); setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000); this.listar(); },
      error: () => { this.confirm.show = false; this.erroGeral = 'Erro ao excluir.'; this.cdr.detectChanges(); }
    });
  }
  confirmCancel() { this.confirm = { show: false, title: '', text: '', loading: false, item: null }; }

  consultar() {
    this.erro = '';
    this.resultados = [];
    if (!this.valor) { this.cdr.detectChanges(); return; }
    const val = this.valor.toLowerCase();
    if (this.campo === 'id') {
      this.resultados = this.itens.filter(f => String(f.id).includes(val));
      if (this.resultados.length === 0) this.erro = 'Não encontrado.';
    } else {
      this.resultados = this.itens.filter(f => String(f[this.campo as keyof Funcionario] ?? '').toLowerCase().includes(val));
      if (this.resultados.length === 0) this.erro = 'Não encontrado.';
    }
    this.cdr.detectChanges();
  }
}
