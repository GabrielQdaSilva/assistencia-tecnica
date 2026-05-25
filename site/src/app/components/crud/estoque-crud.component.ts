import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstoqueService } from '../../core/services/estoque.service';
import { EstoqueItem } from '../../core/types/types';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-estoque-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="crud-bar">
      <button class="btn-primary" (click)="showForm = !showForm">
        {{ showForm ? 'Cancelar' : '+ Nova Peça' }}
      </button>
    </div>

    @if (baixoEstoque.length > 0) {
      <div class="alert-card">
        <strong>⚠ Estoque baixo:</strong>
        @for (p of baixoEstoque; track p.id) {
          <span class="alert-item">{{ p.nome }} ({{ p.quantidade }}/{{ p.estoqueMinimo }})</span>
        }
      </div>
    }

    @if (showForm) {
      <div class="form-card">
        <h3>{{ editId ? 'Editar Peça' : 'Nova Peça' }}</h3>
        <div class="form-grid">
          <input [(ngModel)]="form.nome" placeholder="Nome da peça" class="inp"/>
          <select [(ngModel)]="form.categoria" class="inp">
            <option value="">Categoria</option>
            <option value="Tela">Tela</option>
            <option value="Bateria">Bateria</option>
            <option value="Fonte">Fonte</option>
            <option value="Armazenamento">Armazenamento</option>
            <option value="Memória">Memória</option>
            <option value="Consumível">Consumível</option>
            <option value="Outro">Outro</option>
          </select>
          <input [(ngModel)]="form.quantidade" type="number" placeholder="Quantidade" class="inp"/>
          <input [(ngModel)]="form.estoqueMinimo" type="number" placeholder="Estoque mínimo" class="inp"/>
          <input [(ngModel)]="form.valorCusto" type="number" placeholder="Custo (R$)" class="inp"/>
          <input [(ngModel)]="form.valorVenda" type="number" placeholder="Venda (R$)" class="inp"/>
        </div>
        <div class="form-actions">
          <button class="btn-primary" [disabled]="loading" (click)="salvar()">
            @if (loading) { Salvando... } @else { Salvar }
          </button>
          <button class="btn-sec" (click)="cancelar()">Cancelar</button>
        </div>
      </div>
    }

    <div class="consult-card">
      <h3>Consultar</h3>
      <div class="scope-buttons">
        <button class="scope-btn" [class.active]="campo === 'id'" (click)="campo='id'">ID</button>
        <button class="scope-btn" [class.active]="campo === 'nome'" (click)="campo='nome'">Nome</button>
        <button class="scope-btn" [class.active]="campo === 'categoria'" (click)="campo='categoria'">Categoria</button>
      </div>
      <div class="consult-row">
        <input [(ngModel)]="valor" [placeholder]="'Buscar por ' + campo" class="inp"/>
        <button class="btn-primary" [disabled]="searchLoading" (click)="consultar()">
          @if (searchLoading) { Buscando... } @else { Buscar }
        </button>
      </div>
      @if (resultado) {
        <div class="consult-result">
          <p><strong>ID:</strong> {{ resultado.id }}</p>
          <p><strong>Nome:</strong> {{ resultado.nome }}</p>
          <p><strong>Categoria:</strong> {{ resultado.categoria }}</p>
          <p><strong>Quantidade:</strong> {{ resultado.quantidade }}</p>
          <p><strong>Estoque Mínimo:</strong> {{ resultado.estoqueMinimo }}</p>
          <p><strong>Custo:</strong> R$ {{ resultado.valorCusto.toFixed(2) }}</p>
          <p><strong>Venda:</strong> R$ {{ resultado.valorVenda.toFixed(2) }}</p>
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
        <p class="empty">Nenhuma peça cadastrada.</p>
      } @else {
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Cat.</th><th>Qtd</th><th>Mínimo</th><th>Custo</th><th>Venda</th><th>Margem</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (p of itens; track p.id) {
              <tr [class.low-stock]="p.quantidade <= p.estoqueMinimo">
                <td>{{ p.id }}</td>
                <td>{{ p.nome }}</td>
                <td>{{ p.categoria }}</td>
                <td [class.text-danger]="p.quantidade <= p.estoqueMinimo">{{ p.quantidade }}</td>
                <td>{{ p.estoqueMinimo }}</td>
                <td>R$ {{ p.valorCusto.toFixed(2) }}</td>
                <td>R$ {{ p.valorVenda.toFixed(2) }}</td>
                <td [class.text-success]="margem(p) >= 40">{{ margem(p) }}%</td>
                <td class="actions">
                  <button class="btn-sm btn-blue" (click)="editar(p)">Editar</button>
                  <button class="btn-sm btn-red" (click)="confirmExcluir(p)">Excluir</button>
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
    @if (erroGeral) {
      <p class="err">{{ erroGeral }}</p>
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 24px; }
    .crud-bar { display: flex; gap: 8px; }
    .alert-card {
      background: rgba(249,115,22,.1); border: 1px solid rgba(249,115,22,.2);
      border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
      font-size: .88rem; color: #fb923c;
    }
    .alert-item {
      background: rgba(249,115,22,.1); padding: 4px 12px; border-radius: 6px;
      font-size: .82rem; font-weight: 500;
    }
    .form-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 24px;
      border-left: 3px solid var(--primary);
    }
    .form-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: var(--text); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; margin-bottom: 14px; }
    .form-actions { display: flex; gap: 10px; }
    .table-wrapper {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; min-width: 700px; }
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
    .low-stock td { background: rgba(249,115,22,.04) !important; }
    .text-danger { color: var(--danger); font-weight: 700; }
    .text-success { color: var(--success); font-weight: 600; }
    .actions { display: flex; gap: 6px; white-space: nowrap; }
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
    .btn-sec { padding: 11px 24px; background: var(--surface-hover); color: var(--text); border: none; border-radius: 8px; font-size: .9rem; font-weight: 500; cursor: pointer; }
    .btn-sec:hover { background: var(--border); }
    .btn-sm { padding: 7px 16px; font-size: .8rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: all .2s; }
    .btn-blue { background: var(--primary); color: #fff; }
    .btn-blue:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-red { background: var(--danger); color: #fff; }
    .btn-red:hover { background: var(--danger-hover); transform: translateY(-1px); }
    .err { color: var(--danger); font-size: .9rem; padding: 10px 0; }
    .err::before { content: '\u26A0'; }
    .success {
      color: var(--success); font-size: .9rem; padding: 10px 16px; font-weight: 500;
      background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.15);
      border-radius: 8px;
    }
    .success::before { content: '\u2713'; font-weight: 700; }
  `]
})
export class EstoqueCrudComponent implements OnInit {
  constructor(private service: EstoqueService) {}

  itens: EstoqueItem[] = [];
  showForm = false;
  editId: number | null = null;
  form: Partial<EstoqueItem> = {};
  loading = false;
  listLoading = false;
  searchLoading = false;
  campo = 'id';
  valor = '';
  resultado: EstoqueItem | null = null;
  erro = '';
  sucesso = '';
  erroGeral = '';
  confirm = { show: false, title: '', text: '', loading: false, item: null as EstoqueItem | null };

  get baixoEstoque() { return this.itens.filter(p => p.quantidade <= p.estoqueMinimo); }

  margem(p: EstoqueItem) {
    if (!p.valorVenda) return 0;
    return Math.round((1 - p.valorCusto / p.valorVenda) * 100);
  }

  ngOnInit() { this.listar(); }

  listar() {
    this.listLoading = true;
    this.service.listar().subscribe({
      next: d => { this.itens = d; this.listLoading = false; },
      error: () => { this.erroGeral = 'Erro ao carregar.'; this.listLoading = false; }
    });
  }

  cancelar() {
    this.showForm = false;
    this.editId = null;
    this.form = {};
  }

  salvar() {
    if (!this.form.nome || !this.form.categoria || this.form.quantidade == null) {
      this.erroGeral = 'Nome, Categoria e Quantidade são obrigatórios.';
      return;
    }
    if (Number(this.form.quantidade) < 0) {
      this.erroGeral = 'Quantidade não pode ser negativa.';
      return;
    }
    const dup = this.itens.find(p => p.id !== this.editId && p.nome.toLowerCase() === this.form.nome?.toLowerCase());
    if (dup) {
      this.erroGeral = 'Já existe uma peça com este nome.';
      return;
    }
    this.loading = true;
    this.erroGeral = '';
    const payload: EstoqueItem = {
      nome: this.form.nome,
      quantidade: Number(this.form.quantidade),
      estoqueMinimo: Number(this.form.estoqueMinimo) || 1,
      valorCusto: Number(this.form.valorCusto) || 0,
      valorVenda: Number(this.form.valorVenda) || 0,
      categoria: this.form.categoria
    };
    const op = this.editId
      ? this.service.editar({ ...payload, id: this.editId })
      : this.service.incluir(payload);

    op.subscribe({
      next: () => {
        this.loading = false;
        this.cancelar();
        this.sucesso = 'Peça salva.';
        setTimeout(() => this.sucesso = '', 3000);
        this.listar();
      },
      error: () => { this.erroGeral = 'Erro ao salvar.'; this.loading = false; }
    });
  }

  editar(p: EstoqueItem) {
    this.editId = p.id ?? null;
    this.form = { ...p };
    this.showForm = true;
  }

  confirmExcluir(p: EstoqueItem) {
    this.confirm = { show: true, title: 'Excluir Peça', text: `Excluir "${p.nome}"? Esta ação não pode ser desfeita.`, loading: false, item: p };
  }
  confirmOk() {
    const p = this.confirm.item; if (!p?.id) return; this.confirm.loading = true;
    this.service.excluir(p.id).subscribe({
      next: () => { this.confirm = { show: false, title: '', text: '', loading: false, item: null }; this.sucesso = 'Peça excluída.'; setTimeout(() => this.sucesso = '', 3000); this.listar(); },
      error: () => { this.confirm.show = false; this.erroGeral = 'Erro ao excluir.'; }
    });
  }
  confirmCancel() { this.confirm = { show: false, title: '', text: '', loading: false, item: null }; }

  consultar() {
    this.resultado = null;
    this.erro = '';
    if (!this.valor) { this.erro = 'Informe um valor.'; return; }
    if (this.campo === 'id') {
      const id = Number(this.valor);
      if (isNaN(id)) { this.erro = 'ID deve ser número.'; return; }
      this.searchLoading = true;
      this.service.buscarPorId(id).subscribe({
        next: d => { this.resultado = d; this.searchLoading = false; },
        error: () => { this.erro = 'Não encontrado.'; this.searchLoading = false; }
      });
    } else {
      const val = this.valor.toLowerCase();
      const found = this.itens.find(p => String(p[this.campo as keyof EstoqueItem] ?? '').toLowerCase().includes(val));
      this.resultado = found ?? null;
      if (!found) this.erro = 'Não encontrado.';
    }
  }
}
