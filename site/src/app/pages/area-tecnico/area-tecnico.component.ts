import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdensService } from '../../core/services/ordens.service';
import { ClientesService } from '../../core/services/clientes.service';
import { FuncionariosService } from '../../core/services/funcionarios.service';
import { OrdemServico, Cliente, Funcionario } from '../../core/types/types';

@Component({
  selector: 'app-area-tecnico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard">
      <header class="dash-header">
        <div class="dash-header-inner">
          <a class="dash-logo" routerLink="/">Assistência <span class="accent">Técnica</span></a>
          <span class="dash-badge">Área do Técnico</span>
        </div>
      </header>

      <main class="dash-main">
        <div class="dash-heading">
          <h2>Ordens de Serviço</h2>
          <div class="dash-heading-actions">
            <select [(ngModel)]="filtroStatus" (change)="aplicarFiltro()" class="inp inp-sm">
              <option value="">Todos os status</option>
              <option value="Recebido">Recebido</option>
              <option value="Diagnosticando">Diagnosticando</option>
              <option value="Aguardando Peças">Aguardando Peças</option>
              <option value="Em Reparo">Em Reparo</option>
              <option value="Pronto">Pronto</option>
              <option value="Entregue">Entregue</option>
            </select>
            <button class="btn-primary" (click)="showForm = !showForm">
              {{ showForm ? 'Cancelar' : '+ Nova Ordem' }}
            </button>
          </div>
        </div>

        @if (showForm) {
          <div class="form-card">
            <h3>{{ editId ? 'Editar Ordem #' + editId : 'Nova Ordem de Serviço' }}</h3>
            <div class="form-grid">
              <select [(ngModel)]="form.tecnicoId" class="inp">
                <option [ngValue]="0" disabled>Selecione um técnico</option>
                @for (f of funcionarios; track f.id) {
                  <option [ngValue]="f.id">{{ f.nome }} ({{ f.cargo }})</option>
                }
              </select>
              <select [(ngModel)]="form.clienteId" class="inp">
                <option [ngValue]="0" disabled>Selecione um cliente</option>
                @for (c of clientes; track c.id) {
                  <option [ngValue]="c.id">{{ c.nome }}</option>
                }
              </select>
              <input [(ngModel)]="form.aparelho" placeholder="Aparelho (ex: iPhone 12)" class="inp"/>
              <select [(ngModel)]="form.tipoAparelho" class="inp">
                <option value="">Tipo de aparelho</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Tablet">Tablet</option>
                <option value="Notebook">Notebook</option>
                <option value="Desktop">Desktop</option>
                <option value="Console">Console</option>
                <option value="TV/Monitor">TV/Monitor</option>
                <option value="Outro">Outro</option>
              </select>
              <select [(ngModel)]="form.status" class="inp">
                <option value="Recebido">Recebido</option>
                <option value="Diagnosticando">Diagnosticando</option>
                <option value="Aguardando Peças">Aguardando Peças</option>
                <option value="Em Reparo">Em Reparo</option>
                <option value="Pronto">Pronto</option>
                <option value="Entregue">Entregue</option>
              </select>
            </div>
            <textarea [(ngModel)]="form.defeito" placeholder="Defeito relatado" class="inp inp-area" rows="3"></textarea>
            <div class="form-grid form-grid-3">
              <input [(ngModel)]="form.valorServico" type="number" placeholder="Valor mão de obra" class="inp"/>
              <input [(ngModel)]="form.valorPecas" type="number" placeholder="Valor peças" class="inp"/>
              <input [value]="(form.valorServico ?? 0) + (form.valorPecas ?? 0) || ''" type="text" placeholder="Total" class="inp" readonly/>
            </div>
            <textarea [(ngModel)]="form.observacoes" placeholder="Observações" class="inp inp-area" rows="2"></textarea>
            <div class="form-actions">
              <button class="btn-primary" [disabled]="saving" (click)="salvar()">
                @if (saving) { Salvando... } @else { Salvar }
              </button>
              <button class="btn-sec" (click)="cancelarForm()">Cancelar</button>
            </div>
          </div>
        }

        @if (erro) {
          <p class="err">{{ erro }}</p>
        }
        @if (sucesso) {
          <p class="success">{{ sucesso }}</p>
        }

        <div class="table-wrapper">
          @if (loading) {
            <p class="empty">Carregando...</p>
          } @else if (ordensFiltradas.length === 0) {
            <p class="empty">Nenhuma ordem de serviço encontrada.</p>
          } @else {
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Técnico</th>
                  <th>Cliente</th>
                  <th>Aparelho</th>
                  <th>Defeito</th>
                  <th>Status</th>
                  <th>Entrada</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (o of ordensFiltradas; track o.id) {
                  <tr>
                    <td>{{ o.id }}</td>
                    <td>{{ o.tecnicoNome }}</td>
                    <td>{{ o.clienteNome }}</td>
                    <td>{{ o.aparelho }}</td>
                    <td class="cell-defeito">{{ o.defeito }}</td>
                    <td>
                      <span class="status-badge" [class]="statusClass(o.status)">{{ o.status }}</span>
                    </td>
                    <td>{{ o.dataEntrada }}</td>
                    <td>{{ o.valorTotal ? 'R$ ' + o.valorTotal.toFixed(2) : '-' }}</td>
                    <td class="actions">
                      <button class="btn-sm btn-blue" (click)="editar(o)">Editar</button>
                      <button class="btn-sm btn-red" (click)="excluir(o)">Excluir</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: var(--bg); }

    .dash-header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(19,19,26,.9); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .dash-header-inner {
      max-width: 1280px; margin: 0 auto; padding: 0 24px;
      height: 64px; display: flex; align-items: center; justify-content: space-between;
    }
    .dash-logo { font-size: 1.1rem; font-weight: 700; color: var(--text); text-decoration: none; }
    .dash-logo .accent { color: var(--primary); }
    .dash-badge {
      font-size: .8rem; font-weight: 600; padding: 6px 16px;
      background: rgba(59,130,246,.15); color: var(--primary);
      border-radius: 12px; letter-spacing: .02em;
    }

    .dash-main { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }

    .dash-heading {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
    }
    .dash-heading h2 { font-size: 1.5rem; font-weight: 700; color: var(--text); }
    .dash-heading-actions { display: flex; gap: 10px; align-items: center; }
    .inp-sm { max-width: 200px; }

    .form-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 24px; margin-bottom: 24px;
      border-left: 3px solid var(--primary);
    }
    .form-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: var(--text); }
    .form-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px; margin-bottom: 14px;
    }
    .form-grid-3 { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    .form-actions { display: flex; gap: 10px; margin-top: 16px; }

    .inp {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; padding: 11px 16px;
      color: var(--text); font-size: .9rem;
      outline: none; transition: all .2s; width: 100%;
    }
    .inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
    .inp-area { resize: vertical; font-family: inherit; }

    .table-wrapper {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; min-width: 800px; }
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
    .cell-defeito { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .actions { display: flex; gap: 6px; white-space: nowrap; }
    .empty { padding: 48px; text-align: center; color: var(--text-muted); }

    .status-badge {
      display: inline-block; padding: 4px 12px; border-radius: 20px;
      font-size: .75rem; font-weight: 600; white-space: nowrap;
    }
    .status-recebido { background: rgba(59,130,246,.12); color: #60a5fa; }
    .status-diagnosticando { background: rgba(234,179,8,.12); color: #fbbf24; }
    .status-aguardando-peças { background: rgba(249,115,22,.12); color: #fb923c; }
    .status-em-reparo { background: rgba(168,85,247,.12); color: #c084fc; }
    .status-pronto { background: rgba(34,197,94,.12); color: #4ade80; }
    .status-entregue { background: rgba(107,114,128,.12); color: #9ca3af; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; background: var(--primary); color: #fff;
      border: none; border-radius: 8px; font-size: .9rem; font-weight: 600;
      cursor: pointer; transition: all .2s; white-space: nowrap;
    }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
    .btn-sec {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; background: var(--surface-hover); color: var(--text);
      border: none; border-radius: 8px; font-size: .9rem; font-weight: 500;
      cursor: pointer; transition: all .2s; white-space: nowrap;
    }
    .btn-sec:hover { background: var(--border); }
    .btn-sm {
      padding: 7px 16px; font-size: .8rem; font-weight: 600;
      border: none; border-radius: 6px; cursor: pointer; transition: all .2s;
    }
    .btn-blue { background: var(--primary); color: #fff; }
    .btn-blue:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-red { background: var(--danger); color: #fff; }
    .btn-red:hover { background: var(--danger-hover); transform: translateY(-1px); }

    .err { color: var(--danger); font-size: .9rem; padding: 10px 0; display: flex; align-items: center; gap: 6px; }
    .err::before { content: '⚠'; }
    .success {
      color: var(--success); font-size: .9rem; padding: 10px 16px; font-weight: 500;
      background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.15);
      border-radius: 8px; display: flex; align-items: center; gap: 6px; margin-bottom: 16px;
    }
    .success::before { content: '✓'; font-weight: 700; }
  `]
})
export class AreaTecnicoComponent implements OnInit {
  constructor(
    private ordensService: OrdensService,
    private clientesService: ClientesService,
    private funcionariosService: FuncionariosService
  ) {}

  funcionarios: Funcionario[] = [];
  clientes: Cliente[] = [];
  ordens: OrdemServico[] = [];
  ordensFiltradas: OrdemServico[] = [];
  filtroStatus = '';

  showForm = false;
  editId: number | null = null;
  form: Partial<OrdemServico> = {};
  saving = false;
  loading = false;
  erro = '';
  sucesso = '';

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    this.funcionariosService.listar().subscribe(f => this.funcionarios = f);
    this.clientesService.listar().subscribe(c => this.clientes = c);
    this.ordensService.listar().subscribe({
      next: data => {
        this.ordens = data;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => { this.erro = 'Erro ao carregar ordens.'; this.loading = false; }
    });
  }

  aplicarFiltro() {
    if (this.filtroStatus) {
      this.ordensFiltradas = this.ordens.filter(o => o.status === this.filtroStatus);
    } else {
      this.ordensFiltradas = [...this.ordens];
    }
  }

  cancelarForm() {
    this.showForm = false;
    this.editId = null;
    this.form = {};
  }

  salvar() {
    if (!this.form.tecnicoId || !this.form.clienteId || !this.form.aparelho || !this.form.defeito) {
      this.erro = 'Técnico, Cliente, Aparelho e Defeito são obrigatórios.';
      return;
    }

    this.saving = true;
    this.erro = '';
    const tecnico = this.funcionarios.find(f => f.id === this.form.tecnicoId);
    const cliente = this.clientes.find(c => c.id === this.form.clienteId);

    const payload: OrdemServico = {
      tecnicoId: this.form.tecnicoId,
      tecnicoNome: tecnico?.nome ?? '',
      clienteId: this.form.clienteId,
      clienteNome: cliente?.nome ?? '',
      aparelho: this.form.aparelho,
      tipoAparelho: this.form.tipoAparelho ?? '',
      defeito: this.form.defeito,
      status: (this.form.status as OrdemServico['status']) ?? 'Recebido',
      dataEntrada: this.editId ? (this.form.dataEntrada ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      valorServico: this.form.valorServico ? Number(this.form.valorServico) : undefined,
      valorPecas: this.form.valorPecas ? Number(this.form.valorPecas) : undefined,
      valorTotal: (this.form.valorServico ? Number(this.form.valorServico) : 0) + (this.form.valorPecas ? Number(this.form.valorPecas) : 0) || undefined,
      observacoes: this.form.observacoes
    };

    const op = this.editId
      ? this.ordensService.editar({ ...payload, id: this.editId })
      : this.ordensService.incluir(payload);

    op.subscribe({
      next: () => {
        this.saving = false;
        this.cancelarForm();
        this.sucesso = this.editId ? 'Ordem atualizada com sucesso.' : 'Ordem criada com sucesso.';
        setTimeout(() => this.sucesso = '', 3000);
        this.carregarDados();
      },
      error: () => { this.erro = 'Erro ao salvar ordem.'; this.saving = false; }
    });
  }

  editar(o: OrdemServico) {
    this.editId = o.id ?? null;
    this.form = { ...o };
    this.showForm = true;
  }

  statusClass(s: string): string {
    return 'status-' + s.toLowerCase().replace(/\s+/g, '-');
  }

  excluir(o: OrdemServico) {
    if (!confirm(`Excluir ordem #${o.id} de ${o.clienteNome}?`)) return;
    this.ordensService.excluir(o.id!).subscribe({
      next: () => {
        this.sucesso = 'Ordem excluída com sucesso.';
        setTimeout(() => this.sucesso = '', 3000);
        this.carregarDados();
      },
      error: () => { this.erro = 'Erro ao excluir ordem.'; }
    });
  }
}
