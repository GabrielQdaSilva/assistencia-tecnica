import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { OrdensService } from '../../core/services/ordens.service';
import { ClientesService } from '../../core/services/clientes.service';
import { FuncionariosService } from '../../core/services/funcionarios.service';
import { AuthService } from '../../core/services/auth.service';
import { OrdemServico, Cliente, Funcionario } from '../../core/types/types';
import { ChamadosCrudComponent } from '../../components/crud/chamados-crud.component';
import { FuncionariosCrudComponent } from '../../components/crud/funcionarios-crud.component';
import { ClientesCrudComponent } from '../../components/crud/clientes-crud.component';

@Component({
  selector: 'app-area-gerente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChamadosCrudComponent, FuncionariosCrudComponent, ClientesCrudComponent],
  template: `
    <div class="dashboard">
      <header class="dash-header">
        <div class="dash-header-inner">
          <a class="dash-logo" routerLink="/">Prime <span class="accent">Assistência</span></a>
          <div class="dash-header-right">
            <span class="dash-badge dash-badge-gerente">Gerente</span>
            @if (auth.getUser(); as user) {
              <div class="dash-user">
                <span class="dash-user-name">{{ user.nome }}</span>
                <button class="dash-logout" (click)="sair()" title="Sair">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            }
          </div>
        </div>
      </header>

      <!-- Tabs -->
      <div class="gerente-tabs">
        <button class="gerente-tab" [class.active]="aba === 'dashboard'" (click)="aba = 'dashboard'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </button>
        <button class="gerente-tab" [class.active]="aba === 'ordens'" (click)="aba = 'ordens'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          Ordens
        </button>
        <button class="gerente-tab" [class.active]="aba === 'usuarios'" (click)="aba = 'usuarios'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Usuários
        </button>
          <button class="gerente-tab" [class.active]="aba === 'faturamento'" (click)="aba = 'faturamento'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Faturamento
          </button>
          <button class="gerente-tab" [class.active]="aba === 'chamados'" (click)="aba = 'chamados'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Chamados
          </button>
        <button class="gerente-tab" (click)="sair()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair
        </button>
      </div>

      <main class="dash-main">
        @if (loading) {
          <p class="loading-text">Carregando...</p>
        } @else if (aba === 'dashboard') {
          <!-- KPIs Globais -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <span class="kpi-label">Faturamento Total</span>
              <span class="kpi-value">R$ {{ kpi.faturamentoTotal.toFixed(2) }}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">OS Concluídas</span>
              <span class="kpi-value">{{ kpi.ordensFechadas }}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Ticket Médio</span>
              <span class="kpi-value">R$ {{ kpi.ticketMedio.toFixed(2) }}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Equipe</span>
              <span class="kpi-value">{{ kpi.totalFuncionarios }}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Clientes</span>
              <span class="kpi-value">{{ kpi.totalClientes }}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">OS em Aberto</span>
              <span class="kpi-value">{{ kpi.ordensAbertas }}</span>
            </div>
          </div>

          <!-- Performance por técnico -->
          <div class="section">
            <h3>Performance por Técnico</h3>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Técnico</th>
                    <th>Total OS</th>
                    <th>Concluídas</th>
                    <th>Em Andamento</th>
                    <th>Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of performanceTecnicos; track t.id) {
                    <tr>
                      <td>{{ t.nome }}</td>
                      <td>{{ t.total }}</td>
                      <td>{{ t.concluidas }}</td>
                      <td>{{ t.andamento }}</td>
                      <td>R$ {{ t.faturamento.toFixed(2) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (aba === 'ordens') {
          <div class="section">
            <h3>Todas as Ordens de Serviço</h3>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Técnico</th>
                    <th>Cliente</th>
                    <th>Aparelho</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Entrada</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  @for (o of ordens; track o.id) {
                    <tr>
                      <td>{{ o.id }}</td>
                      <td>{{ o.tecnicoNome }}</td>
                      <td>{{ o.clienteNome }}</td>
                      <td>{{ o.aparelho }}</td>
                      <td><span class="status-badge" [class]="statusClass(o.status)">{{ o.status }}</span></td>
                      <td><span class="prio-badge" [class]="'prio-' + o.prioridade.toLowerCase()">{{ o.prioridade }}</span></td>
                      <td>{{ o.dataEntrada }}</td>
                      <td>{{ o.valorTotal ? 'R$ ' + o.valorTotal.toFixed(2) : '-' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (aba === 'usuarios') {
          <div class="section">
            <h3>Funcionários</h3>
            <app-funcionarios-crud/>
          </div>
          <div class="section">
            <h3>Clientes</h3>
            <app-clientes-crud/>
          </div>
        }

        @if (aba === 'faturamento') {
          <div class="section">
            <h3>Calculadora de Preços</h3>
            <div class="calc-card">
              <div class="calc-grid">
                <div class="field">
                  <label>Valor Mão de Obra (R$)</label>
                  <input [(ngModel)]="calc.maoObra" type="number" class="inp" placeholder="0,00"/>
                </div>
                <div class="field">
                  <label>Valor Peças (R$)</label>
                  <input [(ngModel)]="calc.pecas" type="number" class="inp" placeholder="0,00"/>
                </div>
                <div class="field">
                  <label>Desconto (%)</label>
                  <input [(ngModel)]="calc.desconto" type="number" class="inp" placeholder="0"/>
                </div>
                <div class="field">
                  <label>Garantia (dias)</label>
                  <input [(ngModel)]="calc.garantiaDias" type="number" class="inp" placeholder="90"/>
                </div>
              </div>
              <div class="calc-result">
                <div class="calc-row">
                  <span>Subtotal:</span>
                  <span>R$ {{ (calc.maoObra + calc.pecas).toFixed(2) }}</span>
                </div>
                <div class="calc-row">
                  <span>Desconto ({{ calc.desconto }}%):</span>
                  <span>-R$ {{ ((calc.maoObra + calc.pecas) * calc.desconto / 100).toFixed(2) }}</span>
                </div>
                <div class="calc-row calc-total">
                  <span>Total:</span>
                  <span>R$ {{ ((calc.maoObra + calc.pecas) * (1 - calc.desconto / 100)).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <h3 style="margin-top:32px">Faturamento por Período</h3>
            <div class="period-filter">
              <input [(ngModel)]="periodoInicio" type="date" class="inp inp-sm" (change)="filtrarFaturamento()"/>
              <input [(ngModel)]="periodoFim" type="date" class="inp inp-sm" (change)="filtrarFaturamento()"/>
            </div>
            <div class="table-wrapper" style="margin-top:12px">
              <table>
                <thead>
                  <tr><th>OS</th><th>Cliente</th><th>Data</th><th>Mão de Obra</th><th>Peças</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  @for (o of ordensFaturamento; track o.id) {
                    <tr>
                      <td>#{{ o.id }}</td>
                      <td>{{ o.clienteNome }}</td>
                      <td>{{ o.dataEntrada }}</td>
                      <td>R$ {{ (o.valorServico ?? 0).toFixed(2) }}</td>
                      <td>R$ {{ (o.valorPecas ?? 0).toFixed(2) }}</td>
                      <td><strong>R$ {{ (o.valorTotal ?? 0).toFixed(2) }}</strong></td>
                      <td><span class="status-badge" [class]="statusClass(o.status)">{{ o.status }}</span></td>
                    </tr>
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="5"><strong>Total do período</strong></td>
                    <td><strong>R$ {{ totalPeriodo.toFixed(2) }}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        }

        @if (aba === 'chamados') {
          <div class="section">
            <app-chamados-crud/>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: var(--bg); }
    .dash-header { position: sticky; top: 0; z-index: 100; background: rgba(11,17,32,.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
    .dash-header-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .dash-logo { font-size: 1.1rem; font-weight: 700; color: var(--text); text-decoration: none; }
    .dash-logo .accent { color: var(--primary); }
    .dash-header-right { display: flex; align-items: center; gap: 14px; }
    .dash-badge { font-size: .8rem; font-weight: 600; padding: 6px 16px; border-radius: 12px; letter-spacing: .02em; }
    .dash-badge-gerente { background: rgba(168,85,247,.15); color: #c084fc; }
    .dash-user { display: flex; align-items: center; gap: 10px; }
    .dash-user-name { font-size: .85rem; color: var(--text-muted); font-weight: 500; }
    .dash-logout { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; transition: all .2s; }
    .dash-logout:hover { background: rgba(239,68,68,.1); color: #f87171; border-color: rgba(239,68,68,.2); }

    .gerente-tabs { display: flex; gap: 0; max-width: 1280px; margin: 0 auto; padding: 0 24px; background: var(--surface); border: 1px solid var(--border); border-top: none; border-radius: 0 0 12px 12px; overflow-x: auto; }
    .gerente-tab { display: flex; align-items: center; gap: 8px; padding: 14px 24px; background: transparent; color: var(--text-muted); border: none; cursor: pointer; font-size: .85rem; font-weight: 600; white-space: nowrap; border-bottom: 2px solid transparent; transition: all .2s; }
    .gerente-tab:hover { color: var(--text); background: var(--surface-hover); }
    .gerente-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
    .gerente-tab svg { flex-shrink: 0; }

    .dash-main { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }

    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
    @media (max-width: 700px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 450px) { .kpi-grid { grid-template-columns: 1fr; } }
    .kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
    .kpi-label { font-size: .75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; display: block; margin-bottom: 8px; }
    .kpi-value { font-size: 1.8rem; font-weight: 800; color: var(--text); }

    .section { margin-bottom: 32px; }
    .section h3 { font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 16px; }
    .section h4 { font-size: .9rem; font-weight: 600; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: .04em; }

    tfoot td { font-weight: 600; color: var(--text); border-top: 2px solid var(--primary); }

    .calc-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; border-left: 3px solid var(--primary); }
    .calc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: .78rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; }
    .calc-result { background: var(--bg); border-radius: 8px; padding: 16px; }
    .calc-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: .9rem; color: var(--text-muted); }
    .calc-total { border-top: 1px solid var(--border); margin-top: 8px; padding-top: 12px; font-size: 1.1rem; font-weight: 700; color: var(--text); }
    .period-filter { display: flex; gap: 10px; }
    .loading-text { text-align: center; padding: 80px 24px; color: var(--text-muted); font-size: 1rem; }
  `]
})
export class AreaGerenteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  aba: 'dashboard' | 'ordens' | 'usuarios' | 'faturamento' | 'chamados' = 'dashboard';

  ordens: OrdemServico[] = [];
  funcionarios: Funcionario[] = [];
  clientes: Cliente[] = [];

  kpi = { faturamentoTotal: 0, ordensFechadas: 0, ticketMedio: 0, totalFuncionarios: 0, totalClientes: 0, ordensAbertas: 0 };
  performanceTecnicos: { id: number; nome: string; total: number; concluidas: number; andamento: number; faturamento: number }[] = [];

  loading = false;
  calc = { maoObra: 0, pecas: 0, desconto: 0, garantiaDias: 90 };
  periodoInicio = '';
  periodoFim = '';
  ordensFaturamento: OrdemServico[] = [];
  totalPeriodo = 0;

  constructor(
    private ordensService: OrdensService,
    private clientesService: ClientesService,
    private funcionariosService: FuncionariosService,
    private router: Router,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  statusClass(s: string): string {
    return 'status-' + s.toLowerCase().replace(/\s+/g, '-');
  }

  carregarDados() {
    this.loading = true;
    forkJoin({
      ordens: this.ordensService.listar(),
      funcionarios: this.funcionariosService.listar(),
      clientes: this.clientesService.listar()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => {
        this.ordens = r.ordens;
        this.funcionarios = r.funcionarios;
        this.clientes = r.clientes;
        this.calcularKPIs();
        this.filtrarFaturamento();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  private calcularKPIs() {
    const entregues = this.ordens.filter(o => o.status === 'Pronto' || o.status === 'Entregue');
    const abertas = this.ordens.filter(o => o.status !== 'Pronto' && o.status !== 'Entregue');
    this.kpi.ordensFechadas = entregues.length;
    this.kpi.faturamentoTotal = entregues.reduce((s, o) => s + (o.valorTotal ?? 0), 0);
    this.kpi.ticketMedio = entregues.length ? this.kpi.faturamentoTotal / entregues.length : 0;
    this.kpi.totalFuncionarios = this.funcionarios.length;
    this.kpi.totalClientes = this.clientes.length;
    this.kpi.ordensAbertas = abertas.length;

    this.performanceTecnicos = this.funcionarios.map(f => {
      const ordensDoTecnico = this.ordens.filter(o => o.tecnicoId === f.id);
      return {
        id: Number(f.id ?? 0),
        nome: f.nome,
        total: ordensDoTecnico.length,
        concluidas: ordensDoTecnico.filter(o => o.status === 'Entregue').length,
        andamento: ordensDoTecnico.filter(o => o.status !== 'Entregue').length,
        faturamento: ordensDoTecnico.reduce((s, o) => s + (o.valorTotal ?? 0), 0)
      };
    });
  }

  filtrarFaturamento() {
    let lista = [...this.ordens];
    if (this.periodoInicio) lista = lista.filter(o => o.dataEntrada >= this.periodoInicio);
    if (this.periodoFim) lista = lista.filter(o => o.dataEntrada <= this.periodoFim);
    this.ordensFaturamento = lista;
    this.totalPeriodo = lista.reduce((s, o) => s + (o.valorTotal ?? 0), 0);
  }

  sair() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
