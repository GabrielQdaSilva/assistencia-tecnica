import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrdensService } from '../../core/services/ordens.service';
import { ClientesService } from '../../core/services/clientes.service';
import { FuncionariosService } from '../../core/services/funcionarios.service';
import { EquipamentosService } from '../../core/services/equipamentos.service';
import { AuthService } from '../../core/services/auth.service';
import { OrdemServico, Cliente, Funcionario, Equipamento } from '../../core/types/types';

@Component({
  selector: 'app-area-tecnico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard">
      <header class="dash-header">
        <div class="dash-header-inner">
          <a class="dash-logo" routerLink="/">Prime <span class="accent">Assistência</span></a>
          <div class="dash-header-right">
            <span class="dash-badge">Área do Técnico</span>
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

      <!-- Stats Dashboard -->
      <div class="dash-stats">
        <div class="dash-stats-inner">
          <div class="stat-card" (click)="filtroStatus = ''; aplicarFiltro()">
            <div class="stat-card-icon stat-icon-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
            </div>
            <div class="stat-card-info">
              <span class="stat-card-num">{{ stats.total }}</span>
              <span class="stat-card-label">Total</span>
            </div>
          </div>
          <div class="stat-card" (click)="filtroStatus = 'Na Fila'; aplicarFiltro()">
            <div class="stat-card-icon stat-icon-fila">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="stat-card-info">
              <span class="stat-card-num">{{ stats.fila }}</span>
              <span class="stat-card-label">Na Fila</span>
            </div>
          </div>
          <div class="stat-card" (click)="filtroStatus = 'Em Análise'; aplicarFiltro()">
            <div class="stat-card-icon stat-icon-analise">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div class="stat-card-info">
              <span class="stat-card-num">{{ stats.analise }}</span>
              <span class="stat-card-label">Em Análise</span>
            </div>
          </div>
          <div class="stat-card" (click)="filtroStatus = 'Orçamento Aprovado'; aplicarFiltro()">
            <div class="stat-card-icon stat-icon-aprovado">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </div>
            <div class="stat-card-info">
              <span class="stat-card-num">{{ stats.aprovado }}</span>
              <span class="stat-card-label">Orç. Aprovado</span>
            </div>
          </div>
          <div class="stat-card" (click)="filtroStatus = 'Pronto'; aplicarFiltro()">
            <div class="stat-card-icon stat-icon-pronto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="stat-card-info">
              <span class="stat-card-num">{{ stats.pronto }}</span>
              <span class="stat-card-label">Pronto</span>
            </div>
          </div>
          <div class="stat-card" (click)="filtroStatus = 'Entregue'; aplicarFiltro()">
            <div class="stat-card-icon stat-icon-entregue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="stat-card-info">
              <span class="stat-card-num">{{ stats.entregue }}</span>
              <span class="stat-card-label">Entregue</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast -->
      @if (toast.show) {
        <div class="toast" [class]="'toast-' + toast.tipo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (toast.tipo === 'success') {
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            } @else {
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            }
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      }

      <!-- Confirm Modal -->
      @if (confirm.show) {
        <div class="modal-overlay" (click)="confirmFechar()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h3 class="modal-title">{{ confirm.title }}</h3>
            <p class="modal-text">{{ confirm.text }}</p>
            <div class="modal-actions">
              <button class="btn-sec" (click)="confirmFechar()">Cancelar</button>
              <button class="btn-danger" (click)="confirmConfirmar()">
                @if (confirm.loading) {
                  <span class="spinner-sm"></span> Excluindo...
                } @else {
                  Excluir
                }
              </button>
            </div>
          </div>
        </div>
      }

      <main class="dash-main">
        <div class="dash-heading">
          <h2>Ordens de Serviço</h2>
          <div class="dash-heading-actions">
            <select [(ngModel)]="filtroStatus" (change)="aplicarFiltro()" class="inp inp-sm">
              <option value="">Todos os status</option>
              <option value="Na Fila">Na Fila</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Orçamento Aprovado">Orçamento Aprovado</option>
              <option value="Pronto">Pronto</option>
              <option value="Entregue">Entregue</option>
            </select>
            <div class="view-toggle">
              <button class="view-btn" [class.active]="viewMode === 'table'" (click)="viewMode='table'" title="Visualizar tabela">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button class="view-btn" [class.active]="viewMode === 'kanban'" (click)="viewMode='kanban'" title="Visualizar kanban">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
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
              <select [(ngModel)]="form.equipamentoId" class="inp">
                <option [ngValue]="0" disabled>Selecione equipamento</option>
                @for (e of equipamentos; track e.id) {
                  <option [ngValue]="e.id">{{ e.marca }} {{ e.modelo }} - {{ e.clienteNome }}</option>
                }
              </select>
              <input [(ngModel)]="form.aparelho" placeholder="Aparelho (ex: iPhone 12)" class="inp"/>
              <input [(ngModel)]="form.tipoAparelho" placeholder="Tipo (smartphone, notebook...)" class="inp"/>
              <select [(ngModel)]="form.prioridade" class="inp">
                <option value="Normal">Prioridade: Normal</option>
                <option value="Baixa">Prioridade: Baixa</option>
                <option value="Alta">Prioridade: Alta</option>
                <option value="Urgente">Prioridade: Urgente</option>
              </select>
              <select [(ngModel)]="form.status" class="inp">
                <option value="Na Fila">Na Fila</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Orçamento Aprovado">Orçamento Aprovado</option>
                <option value="Pronto">Pronto</option>
                <option value="Entregue">Entregue</option>
              </select>
              <input [(ngModel)]="form.tempoEstimado" type="number" placeholder="Tempo estimado (dias)" class="inp"/>
            </div>
            <textarea [(ngModel)]="form.defeito" placeholder="Defeito relatado" class="inp inp-area" rows="2"></textarea>
            <textarea [(ngModel)]="form.diagnosticos" placeholder="Diagnóstico técnico" class="inp inp-area" rows="2"></textarea>
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
                @if (editId && form.historico && form.historico.length > 0) {
                  <button class="btn-sec" (click)="showTimeline = !showTimeline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Histórico
                  </button>
                  <button class="btn-sec" (click)="imprimirOS()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Imprimir
                  </button>
                }
              </div>
              @if (showTimeline && form.historico) {
                <div class="timeline">
                  <div class="timeline-title">Linha do Tempo</div>
                  @for (h of form.historico; track $index) {
                    <div class="timeline-item">
                      <div class="timeline-dot" [class]="'td-' + statusClass(h.status)"></div>
                      <div class="timeline-content">
                        <span class="timeline-status">{{ h.status }}</span>
                        <span class="timeline-data">{{ h.data }}</span>
                        <span class="timeline-resp">{{ h.responsavel }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

        @if (viewMode === 'kanban') {
          <div class="kanban-board">
            @for (col of colunasKanban; track col.key) {
              <div class="kanban-col">
                <div class="kanban-col-header" [class]="'kh-' + col.cls">
                  <span class="kanban-col-title">{{ col.label }}</span>
                  <span class="kanban-col-count">{{ col.itens.length }}</span>
                </div>
                <div class="kanban-col-body">
                  @for (o of col.itens; track o.id) {
                    <div class="kanban-card" [class]="'kc-prio-' + o.prioridade.toLowerCase()" (click)="editar(o)">
                      <div class="kc-top">
                        <span class="kc-id">#{{ o.id }}</span>
                        <span class="prio-badge" [class]="'prio-' + o.prioridade.toLowerCase()">{{ o.prioridade }}</span>
                      </div>
                      <strong class="kc-aparelho">{{ o.aparelho }}</strong>
                      <span class="kc-cliente">{{ o.clienteNome }}</span>
                      @if (o.tempoEstimado) {
                        <span class="kc-prazo">{{ o.tempoEstimado }}d</span>
                      }
                      <div class="kc-footer">
                        <span class="kc-tecnico">{{ o.tecnicoNome }}</span>
                        <span class="kc-valor">{{ o.valorTotal ? 'R$ ' + o.valorTotal.toFixed(2) : '' }}</span>
                      </div>
                    </div>
                  }
                  @if (col.itens.length === 0) {
                    <div class="kanban-empty">Vazio</div>
                  }
                </div>
              </div>
            }
          </div>
        }

        @if (viewMode === 'table') {
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
                      <th>Prioridade</th>
                      <th>Técnico</th>
                      <th>Cliente</th>
                      <th>Aparelho</th>
                      <th>Status</th>
                      <th>Entrada</th>
                      <th>Prev.</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    @for (o of ordensFiltradas; track o.id) {
                      <tr>
                        <td>{{ o.id }}</td>
                        <td>
                          <span class="prio-badge" [class]="'prio-' + o.prioridade.toLowerCase()">{{ o.prioridade }}</span>
                        </td>
                        <td>{{ o.tecnicoNome }}</td>
                        <td>{{ o.clienteNome }}</td>
                        <td>{{ o.aparelho }}</td>
                        <td>
                          <span class="status-badge" [class]="statusClass(o.status)">{{ o.status }}</span>
                        </td>
                        <td>{{ o.dataEntrada }}</td>
                        <td>{{ o.tempoEstimado ? o.tempoEstimado + 'd' : '-' }}</td>
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
        }
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
    .dash-header-right { display: flex; align-items: center; gap: 14px; }
    .dash-badge {
      font-size: .8rem; font-weight: 600; padding: 6px 16px;
      background: rgba(59,130,246,.15); color: var(--primary);
      border-radius: 12px; letter-spacing: .02em;
    }
    .dash-user { display: flex; align-items: center; gap: 10px; }
    .dash-user-name { font-size: .85rem; color: var(--text-muted); font-weight: 500; }
    .dash-logout {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px;
      background: transparent; border: 1px solid var(--border);
      color: var(--text-muted); cursor: pointer;
      transition: all .2s;
    }
    .dash-logout:hover { background: rgba(239,68,68,.1); color: #f87171; border-color: rgba(239,68,68,.2); }

    .dash-stats {
      background: var(--surface); border-bottom: 1px solid var(--border);
      position: sticky; top: 64px; z-index: 99;
    }
    .dash-stats-inner {
      max-width: 1280px; margin: 0 auto; padding: 16px 24px;
      display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;
    }
    .stat-card {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: 10px;
      background: var(--bg); border: 1px solid var(--border);
      cursor: pointer; transition: all .2s;
    }
    .stat-card:hover { border-color: var(--primary); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.2); }
    .stat-card-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .stat-icon-all { background: rgba(59,130,246,.12); color: #60a5fa; }
    .stat-icon-fila { background: rgba(59,130,246,.12); color: #60a5fa; }
    .stat-icon-analise { background: rgba(234,179,8,.12); color: #fbbf24; }
    .stat-icon-aprovado { background: rgba(168,85,247,.12); color: #c084fc; }
    .stat-icon-pronto { background: rgba(34,197,94,.12); color: #4ade80; }
    .stat-icon-entregue { background: rgba(107,114,128,.12); color: #9ca3af; }
    .stat-card-info { display: flex; flex-direction: column; }
    .stat-card-num { font-size: 1.2rem; font-weight: 800; color: var(--text); line-height: 1.2; }
    .stat-card-label { font-size: .68rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }
    @media (max-width: 860px) { .dash-stats-inner { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 500px) { .dash-stats-inner { grid-template-columns: repeat(2, 1fr); } }

    .toast {
      position: fixed; top: 80px; right: 24px; z-index: 2000;
      display: flex; align-items: center; gap: 10px;
      padding: 14px 20px; border-radius: 10px;
      font-size: .9rem; font-weight: 500;
      box-shadow: 0 8px 30px rgba(0,0,0,.3);
      animation: slideIn .3s ease-out;
    }
    .toast-success { background: rgba(34,197,94,.12); border: 1px solid rgba(34,197,94,.2); color: #4ade80; }
    .toast-error { background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.2); color: #f87171; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .modal-overlay {
      position: fixed; inset: 0; z-index: 3000;
      background: rgba(0,0,0,.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn .2s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; padding: 32px; max-width: 400px; width: 90%;
      text-align: center; box-shadow: 0 24px 80px rgba(0,0,0,.5);
      animation: scaleIn .2s ease-out;
    }
    @keyframes scaleIn { from { transform: scale(.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .modal-icon { margin-bottom: 16px; }
    .modal-title { font-size: 1.15rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .modal-text { font-size: .9rem; color: var(--text-muted); margin-bottom: 24px; }
    .modal-actions { display: flex; gap: 10px; justify-content: center; }
    .btn-danger {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; background: var(--danger); color: #fff;
      border: none; border-radius: 8px; font-size: .9rem; font-weight: 600;
      cursor: pointer; transition: all .2s;
    }
    .btn-danger:hover { background: var(--danger-hover); transform: translateY(-1px); }
    .spinner-sm {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

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
    .status-na-fila { background: rgba(59,130,246,.12); color: #60a5fa; }
    .status-em-análise { background: rgba(234,179,8,.12); color: #fbbf24; }
    .status-orçamento-aprovado { background: rgba(168,85,247,.12); color: #c084fc; }
    .status-pronto { background: rgba(34,197,94,.12); color: #4ade80; }
    .status-entregue { background: rgba(107,114,128,.12); color: #9ca3af; }

    .prio-badge {
      display: inline-block; padding: 3px 10px; border-radius: 6px;
      font-size: .7rem; font-weight: 700; white-space: nowrap; text-transform: uppercase;
      letter-spacing: .04em;
    }
    .prio-baixa { background: rgba(107,114,128,.12); color: #9ca3af; }
    .prio-normal { background: rgba(59,130,246,.12); color: #60a5fa; }
    .prio-alta { background: rgba(249,115,22,.12); color: #fb923c; }
    .prio-urgente { background: rgba(239,68,68,.12); color: #f87171; }

    .view-toggle { display: flex; gap: 4px; background: var(--surface-hover); border-radius: 8px; padding: 3px; }
    .view-btn {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 6px; border: none;
      background: transparent; color: var(--text-muted); cursor: pointer; transition: all .2s;
    }
    .view-btn:hover { color: var(--text); background: rgba(255,255,255,.04); }
    .view-btn.active { background: var(--bg); color: var(--primary); }

    .kanban-board {
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;
      margin-bottom: 24px; min-height: 300px;
    }
    @media (max-width: 1100px) { .kanban-board { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 700px) { .kanban-board { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 450px) { .kanban-board { grid-template-columns: 1fr; } }
    .kanban-col {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; display: flex; flex-direction: column;
      max-height: 600px;
    }
    .kanban-col-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      border-radius: 12px 12px 0 0; font-size: .82rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: .04em;
    }
    .kh-fila { background: rgba(59,130,246,.08); color: #60a5fa; }
    .kh-analise { background: rgba(234,179,8,.08); color: #fbbf24; }
    .kh-aprovado { background: rgba(168,85,247,.08); color: #c084fc; }
    .kh-pronto { background: rgba(34,197,94,.08); color: #4ade80; }
    .kh-entregue { background: rgba(107,114,128,.08); color: #9ca3af; }
    .kanban-col-title { font-size: .78rem; }
    .kanban-col-count {
      font-size: .75rem; width: 24px; height: 24px; display: flex;
      align-items: center; justify-content: center; border-radius: 6px;
      background: rgba(0,0,0,.2);
    }
    .kanban-col-body {
      flex: 1; overflow-y: auto; padding: 8px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .kanban-card {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 10px; padding: 14px; cursor: pointer;
      transition: all .2s; display: flex; flex-direction: column; gap: 6px;
      border-left: 3px solid transparent;
    }
    .kanban-card:hover { border-color: var(--primary); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.2); }
    .kc-prio-urgente { border-left-color: #f87171; }
    .kc-prio-alta { border-left-color: #fb923c; }
    .kc-prio-normal { border-left-color: #60a5fa; }
    .kc-prio-baixa { border-left-color: #9ca3af; }
    .kc-top { display: flex; align-items: center; justify-content: space-between; }
    .kc-id { font-weight: 700; font-size: .85rem; color: var(--text); }
    .kc-aparelho { font-size: .85rem; font-weight: 600; color: var(--text); }
    .kc-cliente { font-size: .78rem; color: var(--text-muted); }
    .kc-prazo { font-size: .72rem; color: var(--text-muted); }
    .kc-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: .75rem; }
    .kc-tecnico { color: var(--text-muted); }
    .kc-valor { font-weight: 700; color: var(--primary); }
    .kanban-empty { text-align: center; padding: 24px; color: var(--text-muted); font-size: .8rem; }

    .timeline {
      margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border);
    }
    .timeline-title { font-size: .82rem; font-weight: 700; color: var(--text); margin-bottom: 12px; text-transform: uppercase; letter-spacing: .04em; }
    .timeline-item {
      display: flex; gap: 12px; padding-bottom: 16px;
      position: relative;
    }
    .timeline-item:not(:last-child)::after {
      content: ''; position: absolute; left: 7px; top: 18px; bottom: 0;
      width: 2px; background: var(--border);
    }
    .timeline-dot {
      width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 2px;
    }
    .td-na-fila { background: #60a5fa; }
    .td-em-análise { background: #fbbf24; }
    .td-orçamento-aprovado { background: #c084fc; }
    .td-pronto { background: #4ade80; }
    .td-entregue { background: #9ca3af; }
    .timeline-content { display: flex; flex-direction: column; gap: 2px; }
    .timeline-status { font-size: .85rem; font-weight: 600; color: var(--text); }
    .timeline-data { font-size: .75rem; color: var(--text-muted); }
    .timeline-resp { font-size: .75rem; color: var(--text-muted); }

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
    private funcionariosService: FuncionariosService,
    private equipamentosService: EquipamentosService,
    private router: Router,
    public auth: AuthService
  ) {}

  funcionarios: Funcionario[] = [];
  clientes: Cliente[] = [];
  equipamentos: Equipamento[] = [];
  ordens: OrdemServico[] = [];
  ordensFiltradas: OrdemServico[] = [];
  filtroStatus = '';

  showForm = false;
  editId: number | null = null;
  form: Partial<OrdemServico> = {};
  saving = false;
  loading = false;

  viewMode: 'table' | 'kanban' = 'table';
  showTimeline = false;

  toast = { show: false, message: '', tipo: 'success' as 'success' | 'error' };
  confirm = { show: false, title: '', text: '', loading: false, item: null as OrdemServico | null };

  stats = { total: 0, fila: 0, analise: 0, aprovado: 0, pronto: 0, entregue: 0 };

  get colunasKanban() {
    const colunas = [
      { key: 'Na Fila', label: 'Na Fila', cls: 'fila', itens: this.ordensFiltradas.filter(o => o.status === 'Na Fila') },
      { key: 'Em Análise', label: 'Em Análise', cls: 'analise', itens: this.ordensFiltradas.filter(o => o.status === 'Em Análise') },
      { key: 'Orçamento Aprovado', label: 'Orç. Aprovado', cls: 'aprovado', itens: this.ordensFiltradas.filter(o => o.status === 'Orçamento Aprovado') },
      { key: 'Pronto', label: 'Pronto', cls: 'pronto', itens: this.ordensFiltradas.filter(o => o.status === 'Pronto') },
      { key: 'Entregue', label: 'Entregue', cls: 'entregue', itens: this.ordensFiltradas.filter(o => o.status === 'Entregue') }
    ];
    return colunas;
  }

  ngOnInit() {
    this.carregarDados();
  }

  private mostrarToast(message: string, tipo: 'success' | 'error' = 'success') {
    this.toast = { show: true, message, tipo };
    setTimeout(() => this.toast.show = false, 3500);
  }

  carregarDados() {
    this.loading = true;
    forkJoin({
      funcionarios: this.funcionariosService.listar(),
      clientes: this.clientesService.listar(),
      equipamentos: this.equipamentosService.listar(),
      ordens: this.ordensService.listar()
    }).subscribe({
      next: (r) => {
        this.funcionarios = r.funcionarios;
        this.clientes = r.clientes;
        this.equipamentos = r.equipamentos;
        this.ordens = r.ordens;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => { this.loading = false; this.mostrarToast('Erro ao carregar dados.', 'error'); }
    });
  }

  aplicarFiltro() {
    this.ordensFiltradas = this.filtroStatus
      ? this.ordens.filter(o => o.status === this.filtroStatus)
      : [...this.ordens];
    this.stats.total = this.ordens.length;
    this.stats.fila = this.ordens.filter(o => o.status === 'Na Fila').length;
    this.stats.analise = this.ordens.filter(o => o.status === 'Em Análise').length;
    this.stats.aprovado = this.ordens.filter(o => o.status === 'Orçamento Aprovado').length;
    this.stats.pronto = this.ordens.filter(o => o.status === 'Pronto').length;
    this.stats.entregue = this.ordens.filter(o => o.status === 'Entregue').length;
  }

  cancelarForm() {
    this.showForm = false;
    this.editId = null;
    this.form = {};
    this.showTimeline = false;
  }

  salvar() {
    this.saving = true;
    const tecnico = this.funcionarios.find(f => f.id === this.form.tecnicoId);
    const cliente = this.clientes.find(c => c.id === this.form.clienteId);
    const equip = this.equipamentos.find(e => e.id === this.form.equipamentoId);
    const user = this.auth.getUser();
    const novoStatus = (this.form.status as OrdemServico['status']) ?? 'Na Fila';
    const editando = !!this.editId;

    let historico = this.form.historico ? [...this.form.historico] : [];
    if (!editando) {
      historico.push({ status: novoStatus, data: new Date().toISOString().replace('T', ' ').slice(0, 16), responsavel: user?.nome ?? 'Sistema' });
    } else if (this.form.historico && this.form.historico[this.form.historico.length - 1]?.status !== novoStatus) {
      historico.push({ status: novoStatus, data: new Date().toISOString().replace('T', ' ').slice(0, 16), responsavel: user?.nome ?? 'Sistema' });
    }

    const payload: OrdemServico = {
      tecnicoId: this.form.tecnicoId ?? 0,
      tecnicoNome: tecnico?.nome ?? '',
      clienteId: this.form.clienteId ?? 0,
      clienteNome: cliente?.nome ?? '',
      equipamentoId: this.form.equipamentoId,
      equipamentoNome: equip ? `${equip.marca} ${equip.modelo}` : undefined,
      aparelho: this.form.aparelho ?? '',
      tipoAparelho: this.form.tipoAparelho ?? '',
      defeito: this.form.defeito ?? '',
      status: novoStatus,
      prioridade: (this.form.prioridade as OrdemServico['prioridade']) ?? 'Normal',
      dataEntrada: editando ? (this.form.dataEntrada ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      tempoEstimado: this.form.tempoEstimado ? Number(this.form.tempoEstimado) : undefined,
      valorServico: this.form.valorServico ? Number(this.form.valorServico) : undefined,
      valorPecas: this.form.valorPecas ? Number(this.form.valorPecas) : undefined,
      valorTotal: (this.form.valorServico ? Number(this.form.valorServico) : 0) + (this.form.valorPecas ? Number(this.form.valorPecas) : 0) || undefined,
      diagnosticos: this.form.diagnosticos,
      observacoes: this.form.observacoes,
      historico
    };

    const op = editando
      ? this.ordensService.editar({ ...payload, id: this.editId! })
      : this.ordensService.incluir(payload);

    op.subscribe({
      next: () => {
        this.saving = false;
        this.cancelarForm();
        this.mostrarToast(this.editId ? 'Ordem atualizada com sucesso.' : 'Ordem criada com sucesso.');
        this.carregarDados();
      },
      error: () => { this.mostrarToast('Erro ao salvar ordem.', 'error'); this.saving = false; }
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
    this.confirm = {
      show: true,
      title: 'Excluir Ordem',
      text: `Tem certeza que deseja excluir a ordem #${o.id} de ${o.clienteNome}?`,
      loading: false,
      item: o
    };
  }

  confirmFechar() {
    this.confirm.show = false;
    this.confirm.loading = false;
    this.confirm.item = null;
  }

  confirmConfirmar() {
    const item = this.confirm.item;
    if (!item?.id) return;
    this.confirm.loading = true;
    this.ordensService.excluir(item.id).subscribe({
      next: () => {
        this.confirmFechar();
        this.mostrarToast('Ordem excluída com sucesso.');
        this.carregarDados();
      },
      error: () => {
        this.confirm.loading = false;
        this.confirm.show = false;
        this.mostrarToast('Erro ao excluir ordem.', 'error');
      }
    });
  }

  imprimirOS() {
    const id = this.editId;
    const o = this.ordens.find(x => x.id === id);
    if (!o) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>OS #${o.id} - Prime Assistência</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; color: #000; background: #fff; }
        h1 { font-size: 18px; text-align: center; margin-bottom: 4px; }
        h2 { font-size: 13px; text-align: center; color: #555; margin-bottom: 20px; font-weight: normal; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 11px; }
        th { background: #f0f0f0; font-weight: 700; }
        .total { font-size: 14px; font-weight: 700; text-align: right; margin-top: 8px; }
        .footer { text-align: center; margin-top: 24px; font-size: 10px; color: #888; border-top: 1px dashed #ccc; padding-top: 12px; }
      </style></head><body>
      <h1>Prime Assistência</h1>
      <h2>Ordem de Serviço #${o.id}</h2>
      <table><tr><th>Cliente</th><td>${o.clienteNome}</td></tr>
      <tr><th>Aparelho</th><td>${o.aparelho}</td></tr>
      <tr><th>Tipo</th><td>${o.tipoAparelho}</td></tr>
      <tr><th>Defeito</th><td>${o.defeito}</td></tr>
      <tr><th>Diagnóstico</th><td>${o.diagnosticos || '—'}</td></tr>
      <tr><th>Status</th><td>${o.status}</td></tr>
      <tr><th>Prioridade</th><td>${o.prioridade}</td></tr>
      <tr><th>Técnico</th><td>${o.tecnicoNome}</td></tr>
      <tr><th>Entrada</th><td>${o.dataEntrada}</td></tr>
      ${o.tempoEstimado ? `<tr><th>Prazo</th><td>${o.tempoEstimado} dias</td></tr>` : ''}
      ${o.valorServico ? `<tr><th>Mão de obra</th><td>R$ ${o.valorServico.toFixed(2)}</td></tr>` : ''}
      ${o.valorPecas ? `<tr><th>Peças</th><td>R$ ${o.valorPecas.toFixed(2)}</td></tr>` : ''}
      ${o.valorTotal ? `<tr><th>Total</th><td>R$ ${o.valorTotal.toFixed(2)}</td></tr>` : ''}
      </table>
      ${o.observacoes ? `<p><strong>Observações:</strong> ${o.observacoes}</p>` : ''}
      <div class="footer">Documento gerado em ${new Date().toLocaleString('pt-BR')} - Prime Assistência</div>
      <script>window.print();window.close();</script>
      </body></html>
    `);
    w.document.close();
  }

  sair() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
