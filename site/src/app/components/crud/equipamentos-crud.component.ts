import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EquipamentosService } from '../../core/services/equipamentos.service';
import { ClientesService } from '../../core/services/clientes.service';
import { Equipamento, Cliente } from '../../core/types/types';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-equipamentos-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="crud-bar">
      <button class="btn-primary" (click)="showForm = !showForm">
        {{ showForm ? 'Cancelar' : '+ Novo Equipamento' }}
      </button>
    </div>

    @if (showForm) {
      <div class="form-card">
        <h3>{{ editId ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
        <div class="form-grid">
          <label class="field">
            <span class="field-label">Cliente</span>
            <select [(ngModel)]="form.clienteId" class="inp">
              <option [ngValue]="0" disabled>Selecione o cliente</option>
              @for (c of clientes; track c.id) {
                <option [ngValue]="c.id">{{ c.nome }}</option>
              }
            </select>
          </label>
          <label class="field">
            <span class="field-label">Marca</span>
            <input [(ngModel)]="form.marca" placeholder="Marca" class="inp"/>
          </label>
          <label class="field">
            <span class="field-label">Modelo</span>
            <input [(ngModel)]="form.modelo" placeholder="Modelo" class="inp"/>
          </label>
          <label class="field">
            <span class="field-label">Nº Série</span>
            <input [(ngModel)]="form.serial" placeholder="Nº Série" class="inp"/>
          </label>
          <label class="field">
            <span class="field-label">IMEI / Patrimônio</span>
            <input [(ngModel)]="form.imei" placeholder="IMEI / Patrimônio" class="inp"/>
          </label>
        </div>
        <label class="field field-area">
          <span class="field-label">Observações</span>
          <textarea [(ngModel)]="form.observacoes" placeholder="Observações" class="inp inp-area" rows="2"></textarea>
        </label>
        <div class="form-actions">
          <button class="btn-primary" [disabled]="loading" (click)="salvar()">
            @if (loading) { Salvando... } @else { Salvar }
          </button>
          <button class="btn-sec" (click)="cancelar()">Cancelar</button>
        </div>
        @if (erroGeral) {
          <p class="err">{{ erroGeral }}</p>
        }
      </div>
    }

    <div class="consult-card">
      <h3>Consultar</h3>
      <div class="scope-buttons">
        <button class="scope-btn" [class.active]="campo === 'id'" (click)="campo='id'">ID</button>
        <button class="scope-btn" [class.active]="campo === 'serial'" (click)="campo='serial'">Nº Série</button>
        <button class="scope-btn" [class.active]="campo === 'imei'" (click)="campo='imei'">IMEI</button>
        <button class="scope-btn" [class.active]="campo === 'clienteNome'" (click)="campo='clienteNome'">Cliente</button>
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
              <p><strong>Cliente:</strong> {{ r.clienteNome }}</p>
              <p><strong>Marca/Modelo:</strong> {{ r.marca }} {{ r.modelo }}</p>
              <p><strong>Serial:</strong> {{ r.serial || '-' }}</p>
              <p><strong>IMEI:</strong> {{ r.imei || '-' }}</p>
              <p><strong>Obs:</strong> {{ r.observacoes || '-' }}</p>
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
        <p class="empty">Nenhum equipamento cadastrado.</p>
      } @else {
        <table>
          <thead>
            <tr><th>ID</th><th>Cliente</th><th>Marca/Modelo</th><th>Serial</th><th>IMEI</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (e of itens; track e.id) {
              <tr>
                <td>{{ e.id }}</td>
                <td>{{ e.clienteNome }}</td>
                <td>{{ e.marca }} {{ e.modelo }}</td>
                <td>{{ e.serial || '-' }}</td>
                <td>{{ e.imei || '-' }}</td>
                <td class="actions">
                  <button class="btn-sm btn-blue" (click)="editar(e)">Editar</button>
                  <button class="btn-sm btn-red" (click)="confirmExcluir(e)">Excluir</button>
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
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; margin-bottom: 14px; }
    .form-actions { display: flex; gap: 10px; }
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
    .inp-area { resize: vertical; font-family: inherit; }
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
export class EquipamentosCrudComponent implements OnInit {
  constructor(
    private service: EquipamentosService,
    private clientesService: ClientesService,
    private cdr: ChangeDetectorRef
  ) {}

  itens: Equipamento[] = [];
  clientes: Cliente[] = [];
  showForm = false;
  editId: number | null = null;
  form: Partial<Equipamento> = {};
  loading = false;
  listLoading = false;
  campo = 'id';
  valor = '';
  resultados: Equipamento[] = [];
  erro = '';
  sucesso = '';
  erroGeral = '';
  private destroy$ = new Subject<void>();
  confirm = { show: false, title: '', text: '', loading: false, item: null as Equipamento | null };

  ngOnInit() {
    this.clientesService.listar().pipe(takeUntil(this.destroy$)).subscribe(cs => this.clientes = cs.filter(c => c.ativo));
    this.listar();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listar() {
    this.listLoading = true;
    this.service.listar().pipe(takeUntil(this.destroy$)).subscribe({
      next: d => { this.itens = d; this.listLoading = false; this.cdr.detectChanges(); },
      error: () => { this.erroGeral = 'Erro ao carregar.'; this.listLoading = false; this.cdr.detectChanges(); }
    });
  }

  cancelar() {
    this.showForm = false;
    this.editId = null;
    this.form = {};
  }

  salvar() {
    if (!this.form.clienteId || !this.form.marca || !this.form.modelo) {
      this.erroGeral = 'Cliente, Marca e Modelo são obrigatórios.';
      return;
    }
    if (this.form.serial) {
      const dupSerial = this.itens.find(e => e.id !== this.editId && e.serial === this.form.serial);
      if (dupSerial) { this.erroGeral = 'Já existe equipamento com este Nº de Série.'; return; }
    }
    if (this.form.imei) {
      const dupImei = this.itens.find(e => e.id !== this.editId && e.imei === this.form.imei);
      if (dupImei) { this.erroGeral = 'Já existe equipamento com este IMEI.'; return; }
    }
    this.loading = true;
    this.erroGeral = '';
    const cliente = this.clientes.find(c => c.id === this.form.clienteId);
    const payload: Equipamento = {
      clienteId: this.form.clienteId,
      clienteNome: cliente?.nome ?? '',
      marca: this.form.marca,
      modelo: this.form.modelo,
      serial: this.form.serial,
      imei: this.form.imei,
      observacoes: this.form.observacoes
    };
    const op = this.editId
      ? this.service.editar({ ...payload, id: this.editId })
      : this.service.incluir(payload);

    op.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading = false;
        this.cancelar();
        this.sucesso = 'Equipamento salvo.';
        this.cdr.detectChanges();
        setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000);
        this.listar();
      },
      error: () => { this.erroGeral = 'Erro ao salvar.'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  editar(e: Equipamento) {
    this.editId = e.id ?? null;
    this.form = { ...e };
    this.showForm = true;
  }

  confirmExcluir(e: Equipamento) {
    this.confirm = { show: true, title: 'Excluir Equipamento', text: `Excluir "${e.marca} ${e.modelo}"?`, loading: false, item: e };
  }
  confirmOk() {
    const e = this.confirm.item; if (!e?.id) return; this.confirm.loading = true;
    this.service.excluir(e.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.confirm = { show: false, title: '', text: '', loading: false, item: null }; this.sucesso = 'Equipamento excluído.'; this.cdr.detectChanges(); setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000); this.listar(); },
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
      this.resultados = this.itens.filter(e => String(e.id).includes(val));
      if (this.resultados.length === 0) this.erro = 'Não encontrado.';
    } else {
      this.resultados = this.itens.filter(e => String(e[this.campo as keyof Equipamento] ?? '').toLowerCase().includes(val));
      if (this.resultados.length === 0) this.erro = 'Não encontrado.';
    }
    this.cdr.detectChanges();
  }
}
