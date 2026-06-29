import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, catchError, switchMap, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { OrdensService } from '../../core/services/ordens.service';
import { ClientesService } from '../../core/services/clientes.service';
import { MensagensService } from '../../core/services/mensagens.service';
import { ChamadosService } from '../../core/services/chamados.service';
import { ChamadoMensagensService } from '../../core/services/chamado-mensagens.service';
import { EquipamentosService } from '../../core/services/equipamentos.service';
import { OrdemServico, Mensagem, Chamado, ChamadoMensagem, Equipamento } from '../../core/types/types';

@Component({
  selector: 'app-minha-conta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cliente-page">
      <header class="cliente-header">
        <div class="cliente-header-inner">
          <a class="cliente-logo" routerLink="/">Prime <span class="accent">Assistência</span></a>
          <div class="cliente-header-right">
            <span class="cliente-badge">Minha Conta</span>
            @if (auth.getUser(); as user) {
              <button class="cliente-logout" (click)="sair()" title="Sair">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            }
          </div>
        </div>
      </header>

      <main class="cliente-main">
        <div class="cliente-welcome">
          <h1>Olá, {{ auth.getUser()?.nome }}!</h1>
          <p>Aqui você pode acompanhar seus pedidos, conversar com a equipe e abrir chamados.</p>
        </div>

        <!-- Stats Globais -->
        <section class="cliente-stats">
          @if (statsError) {
            <div class="stats-error">
              <span>Não foi possível carregar as estatísticas. Verifique se o backend está rodando.</span>
            </div>
          } @else if (statsLoading) {
            <div class="stats-grid">
              <div class="stat-item"><span class="stat-num">...</span><span class="stat-label">Ordens de Serviço</span></div>
              <div class="stat-item"><span class="stat-num">...</span><span class="stat-label">Clientes Ativos</span></div>
              <div class="stat-item"><span class="stat-num">...</span><span class="stat-label">Equipamentos</span></div>
              <div class="stat-item"><span class="stat-num">...</span><span class="stat-label">Receita Total</span></div>
            </div>
          } @else {
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-num">{{ stats.totalOS }}</span>
                <span class="stat-label">Ordens de Serviço</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">{{ stats.clientesAtivos }}</span>
                <span class="stat-label">Clientes Ativos</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">{{ stats.equipamentos }}</span>
                <span class="stat-label">Equipamentos</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">R$ {{ stats.receita }}</span>
                <span class="stat-label">Receita Total</span>
              </div>
            </div>
          }
        </section>

        <!-- Abas -->
        <div class="cliente-tabs">
          <button class="cliente-tab" [class.active]="aba === 'pedidos'" (click)="aba='pedidos'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            Meus Pedidos
          </button>
          <button class="cliente-tab" [class.active]="aba === 'chat'" (click)="aba='chat'; carregarChat()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Conversar
          </button>
          <button class="cliente-tab" [class.active]="aba === 'chamados'" (click)="aba='chamados'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Chamados
          </button>
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

        <!-- Pedidos -->
        @if (aba === 'pedidos') {
          <div class="section-card">
            <h2>Meus Pedidos</h2>
            @if (pedidos.length === 0) {
              <p class="empty-state">Nenhum pedido encontrado.</p>
            } @else {
              <div class="pedidos-grid">
                @for (p of pedidos; track p.id) {
                  <div class="pedido-card" [class]="'pedido-' + statusClass(p.status)">
                    <div class="pedido-top">
                      <span class="pedido-id">#{{ p.id }}</span>
                      <span class="pedido-status" [class]="'status-' + statusClass(p.status)">{{ p.status }}</span>
                    </div>
                    <div class="pedido-body">
                      <div class="pedido-info">
                        <strong>{{ p.aparelho }}</strong>
                        <span>{{ p.tipoAparelho }}</span>
                      </div>
                      <p class="pedido-defeito">{{ p.defeito }}</p>
                      @if (p.diagnosticos) {
                        <div class="pedido-diagnostico">
                          <strong>Diagnóstico:</strong> {{ p.diagnosticos }}
                        </div>
                      }
                    </div>
                    <div class="pedido-footer">
                      <span class="pedido-data">Entrada: {{ p.dataEntrada }}</span>
                      @if (p.valorTotal) {
                        <span class="pedido-valor">R$ {{ p.valorTotal.toFixed(2) }}</span>
                      }
                      @if (p.tempoEstimado) {
                        <span class="pedido-prazo">Prazo: {{ p.tempoEstimado }} dias</span>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Chat -->
        @if (aba === 'chat') {
          <div class="section-card">
            <h2>Conversar com a Equipe</h2>

            @if (pedidos.length === 0) {
              <p class="empty-state">Você não possui pedidos para conversar.</p>
            } @else {
              <div class="chat-select">
                <label>Pedido:</label>
                <select [(ngModel)]="chatOrdemId" (change)="carregarChat()" class="inp">
                  <option [ngValue]="0" disabled>Selecione um pedido</option>
                  @for (p of pedidos; track p.id) {
                    <option [ngValue]="p.id">#{{ p.id }} — {{ p.aparelho }}</option>
                  }
                </select>
              </div>

              @if (chatOrdemId) {
                <div class="chat-box">
                  <div class="chat-msgs" #chatBox>
                    @if (mensagens.length === 0) {
                      <p class="chat-empty">Nenhuma mensagem ainda. Envie sua dúvida!</p>
                    }
                    @for (m of mensagens; track m.id) {
                      <div class="chat-msg" [class.chat-cliente]="m.remetente === 'cliente'" [class.chat-tecnico]="m.remetente === 'tecnico'">
                        <div class="chat-msg-header">
                          <strong>{{ m.remetenteNome }}</strong>
                          <span class="chat-msg-time">{{ m.data | slice:0:16 }}</span>
                        </div>
                        <p>{{ m.texto }}</p>
                      </div>
                    }
                  </div>
                  <div class="chat-input">
                    <input [(ngModel)]="chatTexto" placeholder="Digite sua mensagem..." class="inp" (keyup.enter)="enviarMsg()"/>
                    <button class="btn-primary" [disabled]="!chatTexto.trim()" (click)="enviarMsg()">Enviar</button>
                  </div>
                </div>
              }
            }
          </div>
        }

        <!-- Chamados -->
        @if (aba === 'chamados') {
          <div class="section-card">
            <div class="chamados-header">
              <h2>Meus Chamados ({{ meusChamados.length }})</h2>
              <button class="btn-primary" (click)="showChamadoForm = !showChamadoForm">
                {{ showChamadoForm ? 'Cancelar' : '+ Novo Chamado' }}
              </button>
            </div>

            @if (showChamadoForm) {
              <div class="chamado-form">
                <select [(ngModel)]="chamadoForm.equipamentoId" class="inp">
                  <option [ngValue]="0">Sem equipamento (opcional)</option>
                  @for (e of meusEquipamentos; track e.id) {
                    <option [ngValue]="e.id">{{ e.marca }} {{ e.modelo }} ({{ e.serial || e.imei || '—' }})</option>
                  }
                </select>
                <textarea [(ngModel)]="chamadoForm.descricao" placeholder="Descreva o problema em detalhes..." class="inp inp-area" rows="3"></textarea>
                <div class="form-actions">
                  <button class="btn-primary" [disabled]="!chamadoForm.descricao.trim()" (click)="abrirChamado()">Abrir Chamado</button>
                </div>
              </div>
            }

            @if (meusChamados.length === 0) {
              <p class="empty-state">Nenhum chamado aberto.</p>
            } @else {
              <div class="chamados-lista">
                @for (ch of meusChamados; track ch.id) {
                  <div class="chamado-card" [class.chamado-card-ativo]="chamadoAberto?.id === ch.id" (click)="abrirConversa(ch)">
                    <div class="chamado-top">
                      <span class="chamado-id">#{{ ch.id }}</span>
                      <span class="chamado-status" [class]="chamadoStatusClass(ch.status)">{{ ch.status }}</span>
                    </div>
                    <p class="chamado-desc">{{ ch.descricao }}</p>
                    <div class="chamado-footer">
                      @if (ch.equipamentoNome) {
                        <span class="chamado-equip">{{ ch.equipamentoNome }}</span>
                      }
                      <span class="chamado-data">{{ ch.data }}</span>
                      @if (chamadoMsgCount(ch.id) > 0) {
                        <span class="chamado-msgs">{{ chamadoMsgCount(ch.id) }} resp{{ chamadoMsgCount(ch.id) !== 1 ? 'ostas' : 'osta' }}</span>
                      }
                    </div>
                  </div>

                  <!-- Conversa do chamado selecionado -->
                  @if (chamadoAberto?.id === ch.id) {
                    <div class="conversa-thread" (click)="$event.stopPropagation()">
                      @if (conversaMensagens.length === 0) {
                        <p class="conversa-empty">Ainda não há respostas. A equipe irá responder em breve.</p>
                      }
                      @for (m of conversaMensagens; track m.id) {
                        <div class="conv-msg" [class.conv-cliente]="m.remetente === 'cliente'" [class.conv-equipe]="m.remetente !== 'cliente'">
                          <div class="conv-msg-header">
                            <strong>{{ m.remetenteNome }}</strong>
                            <span class="conv-role">
                              @if (m.remetente !== 'cliente') { Equipe } @else { Você }
                            </span>
                            <span class="conv-time">{{ m.data | slice:0:16 }}</span>
                          </div>
                          <p class="conv-text">{{ m.texto }}</p>
                        </div>
                      }
                      @if (ch.status !== 'Fechado') {
                        <div class="conv-reply">
                          <textarea [(ngModel)]="convReplyTexto" class="inp inp-area" rows="2" placeholder="Digite sua resposta..." (keydown.enter)="onReplyKeydown($event)"></textarea>
                          <div class="conv-reply-bar">
                            <span class="conv-hint">Enter para enviar · Shift+Enter para nova linha</span>
                            <button class="btn-primary" [disabled]="!convReplyTexto.trim() || sendingReply" (click)="enviarResposta()">
                              @if (sendingReply) { Enviando... } @else { Responder }
                            </button>
                          </div>
                        </div>
                      } @else {
                        <p class="conv-fechado">Este chamado está fechado.</p>
                      }
                    </div>
                  }
                }
              </div>
            }
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .cliente-page { min-height: 100vh; background: var(--bg); }

    .cliente-header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(11,17,32,.92); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .cliente-header-inner {
      max-width: 980px; margin: 0 auto; padding: 0 24px;
      height: 64px; display: flex; align-items: center; justify-content: space-between;
    }
    .cliente-logo { font-size: 1.1rem; font-weight: 700; color: var(--text); text-decoration: none; }
    .cliente-logo .accent { color: var(--primary); }
    .cliente-header-right { display: flex; align-items: center; gap: 14px; }
    .cliente-badge {
      font-size: .8rem; font-weight: 600; padding: 6px 16px;
      background: var(--primary-light); color: var(--primary);
      border-radius: 12px;
    }
    .cliente-logout {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px;
      background: transparent; border: 1px solid var(--border);
      color: var(--text-muted); cursor: pointer; transition: all .2s;
    }
    .cliente-logout:hover { background: rgba(239,68,68,.1); color: #f87171; border-color: rgba(239,68,68,.2); }

    .cliente-main { max-width: 980px; margin: 0 auto; padding: 32px 24px; }
    .cliente-welcome { margin-bottom: 28px; }
    .cliente-welcome h1 { font-size: 1.6rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .cliente-welcome p { color: var(--text-muted); font-size: .95rem; }

    .cliente-tabs { display: flex; gap: 0; margin-bottom: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 4px; }
    .cliente-tab {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 20px; background: transparent; color: var(--text-muted);
      border: none; cursor: pointer; font-size: .85rem; font-weight: 600;
      border-radius: 8px; transition: all .2s;
    }
    .cliente-tab:hover { color: var(--text); background: var(--surface-hover); }
    .cliente-tab.active { color: #fff; background: var(--primary); }
    .cliente-tab svg { flex-shrink: 0; }

    .section-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; padding: 28px;
    }
    .section-card h2 { font-size: 1.2rem; font-weight: 700; color: var(--text); margin-bottom: 20px; }
    .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }

    .pedidos-grid { display: flex; flex-direction: column; gap: 14px; }
    .pedido-card {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 12px; padding: 20px; transition: all .2s;
    }
    .pedido-card:hover { border-color: rgba(6,182,212,.2); }
    .pedido-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .pedido-id { font-weight: 700; color: var(--text); font-size: .95rem; }
    .pedido-status {
      display: inline-block; padding: 4px 12px; border-radius: 20px;
      font-size: .75rem; font-weight: 600;
    }
    .status-na-fila { background: var(--primary-light); color: var(--primary); }
    .status-em-análise { background: rgba(234,179,8,.12); color: #fbbf24; }
    .status-orçamento-aprovado { background: rgba(168,85,247,.12); color: #c084fc; }
    .status-pronto { background: rgba(34,197,94,.12); color: #4ade80; }
    .status-entregue { background: rgba(107,114,128,.12); color: #9ca3af; }
    .pedido-body { margin-bottom: 12px; }
    .pedido-info { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; }
    .pedido-info strong { font-size: 1rem; color: var(--text); }
    .pedido-info span { font-size: .8rem; color: var(--text-muted); }
    .pedido-defeito { font-size: .85rem; color: var(--text-muted); line-height: 1.5; }
    .pedido-diagnostico {
      margin-top: 10px; padding: 10px 14px;
      background: var(--primary-light); border-radius: 8px;
      font-size: .83rem; color: var(--text-muted); line-height: 1.5;
    }
    .pedido-diagnostico strong { color: var(--text); }
    .pedido-footer { display: flex; gap: 20px; font-size: .8rem; color: var(--text-muted); }
    .pedido-valor { font-weight: 700; color: var(--primary); }
    .pedido-prazo { color: var(--text-muted); }

    .chat-select { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .chat-select label { font-weight: 600; color: var(--text-muted); font-size: .85rem; white-space: nowrap; }
    .chat-box {
      border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
    }
    .chat-msgs {
      max-height: 360px; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .chat-empty { text-align: center; color: var(--text-muted); font-size: .85rem; padding: 20px; }
    .chat-msg {
      max-width: 80%; padding: 12px 16px; border-radius: 12px;
      font-size: .87rem; line-height: 1.5;
    }
    .chat-cliente {
      align-self: flex-end; background: var(--primary-light);
      border-bottom-right-radius: 4px;
    }
    .chat-tecnico {
      align-self: flex-start; background: var(--surface-hover);
      border: 1px solid var(--border); border-bottom-left-radius: 4px;
    }
    .chat-msg-header { display: flex; gap: 8px; margin-bottom: 4px; font-size: .78rem; }
    .chat-msg-header strong { color: var(--text); }
    .chat-msg-time { color: var(--text-muted); }
    .chat-msg p { color: var(--text-muted); }
    .chat-input {
      display: flex; gap: 8px; padding: 12px 16px;
      border-top: 1px solid var(--border); background: var(--bg);
    }

    .chamados-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .chamados-header h2 { margin-bottom: 0; }
    .chamado-form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; padding: 20px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; }
    .form-actions { display: flex; gap: 10px; }
    .chamados-lista { display: flex; flex-direction: column; gap: 12px; }
    .chamado-card {
      padding: 16px 20px; background: var(--bg); border: 1px solid var(--border);
      border-radius: 10px; display: flex; flex-direction: column; gap: 8px;
    }
    .chamado-top { display: flex; align-items: center; justify-content: space-between; }
    .chamado-id { font-weight: 700; font-size: .9rem; color: var(--text); }
    .chamado-status {
      display: inline-block; padding: 3px 10px; border-radius: 12px;
      font-size: .72rem; font-weight: 600;
    }
    .ch-status-aberto { background: var(--primary-light); color: var(--primary); }
    .ch-status-em-andamento { background: rgba(234,179,8,.12); color: #fbbf24; }
    .ch-status-resolvido { background: rgba(34,197,94,.12); color: #4ade80; }
    .ch-status-fechado { background: rgba(107,114,128,.12); color: #9ca3af; }
    .chamado-desc { font-size: .85rem; color: var(--text-muted); line-height: 1.5; }
    .chamado-equip { font-size: .8rem; color: var(--text-muted); }
    .chamado-data { font-size: .78rem; color: var(--text-muted); }
    .chamado-card { cursor: pointer; transition: all .15s; }
    .chamado-card:hover { border-color: var(--primary); }
    .chamado-card-ativo { border-color: var(--primary); border-left: 3px solid var(--primary); }
    .chamado-footer { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .chamado-msgs { font-size: .75rem; color: var(--primary); font-weight: 600; margin-left: auto; }

    .cliente-stats { margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); text-align: center; }
    .stat-item { padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--border); transition: all var(--transition-slow); display: flex; flex-direction: column; gap: 4px; background: var(--surface); }
    .stat-item:hover { border-color: rgba(6,182,212,.2); transform: translateY(-2px); box-shadow: var(--shadow); }
    .stat-num { font-size: var(--text-2xl); font-weight: 800; color: var(--primary); }
    .stat-label { font-size: var(--text-sm); color: var(--text-muted); }
    .stats-error { text-align: center; padding: var(--space-6); color: var(--text-muted); font-size: var(--text-sm); background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); border-radius: var(--radius-md); }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    .conversa-thread {
      margin: -8px 0 8px; padding: 16px 20px;
      background: var(--surface); border: 1px solid var(--border); border-top: none;
      border-radius: 0 0 10px 10px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .conversa-empty { text-align: center; padding: 20px; color: var(--text-muted); font-size: .85rem; }
    .conv-msg { padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); }
    .conv-cliente { background: var(--primary-light); margin-right: 40px; }
    .conv-equipe { background: var(--surface-hover); margin-left: 40px; }
    .conv-msg-header { display: flex; gap: 10px; align-items: center; margin-bottom: 4px; flex-wrap: wrap; }
    .conv-msg-header strong { font-size: .8rem; color: var(--text); }
    .conv-role { font-size: .68rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
    .conv-time { font-size: .7rem; color: var(--text-muted); margin-left: auto; }
    .conv-text { font-size: .85rem; color: var(--text); line-height: 1.5; margin: 0; white-space: pre-wrap; }
    .conv-reply { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
    .conv-reply .inp-area { width: 100%; }
    .conv-reply-bar { display: flex; align-items: center; justify-content: space-between; }
    .conv-hint { font-size: .72rem; color: var(--text-muted); }
    .conv-fechado { text-align: center; padding: 12px; color: var(--text-muted); font-size: .82rem; font-style: italic; }

  `]
})
export class MinhaContaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  aba: 'pedidos' | 'chat' | 'chamados' = 'pedidos';

  statsError = false;
  statsLoading = true;
  stats = {
    totalOS: 0,
    clientesAtivos: 0,
    equipamentos: 0,
    receita: 0
  };

  pedidos: OrdemServico[] = [];
  meusChamados: Chamado[] = [];
  meusEquipamentos: Equipamento[] = [];

  chatOrdemId = 0;
  chatTexto = '';
  mensagens: Mensagem[] = [];

  showChamadoForm = false;
  chamadoForm = { equipamentoId: 0, descricao: '' };

  toast = { show: false, message: '', tipo: 'success' as 'success' | 'error' };

  chamadoAberto: Chamado | null = null;
  conversaMensagens: ChamadoMensagem[] = [];
  convReplyTexto = '';
  sendingReply = false;
  msgCountMap: Record<number, number> = {};

  constructor(
    public auth: AuthService,
    private ordensService: OrdensService,
    private clientesService: ClientesService,
    private mensagensService: MensagensService,
    private chamadosService: ChamadosService,
    private chamadoMsgService: ChamadoMensagensService,
    private equipamentosService: EquipamentosService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) { this.router.navigate(['/login']); return; }
    this.carregarDados();
    this.carregarStats();
  }

  private carregarStats() {
    let ordensOk = false, clientesOk = false, equipOk = false;

    const tentarFinalizar = () => {
      if (ordensOk && clientesOk && equipOk) {
        this.statsLoading = false;
      }
    };

    this.ordensService.listar().pipe(
      takeUntil(this.destroy$),
      catchError(() => { this.statsError = true; this.statsLoading = false; return throwError(() => new Error('')); })
    ).subscribe(ordens => {
      this.stats.totalOS = ordens.length;
      this.stats.receita = ordens
        .filter(o => (o.status === 'Pronto' || o.status === 'Entregue') && o.valorTotal)
        .reduce((acc, o) => acc + (o.valorTotal ?? 0), 0);
      ordensOk = true;
      tentarFinalizar();
    });

    this.clientesService.listar().pipe(
      takeUntil(this.destroy$),
      catchError(() => { this.statsError = true; this.statsLoading = false; return throwError(() => new Error('')); })
    ).subscribe(c => {
      this.stats.clientesAtivos = c.filter(c => c.ativo).length;
      clientesOk = true;
      tentarFinalizar();
    });

    this.equipamentosService.listar().pipe(
      takeUntil(this.destroy$),
      catchError(() => { this.statsError = true; this.statsLoading = false; return throwError(() => new Error('')); })
    ).subscribe(e => {
      this.stats.equipamentos = e.length;
      equipOk = true;
      tentarFinalizar();
    });
  }

  private mostrarToast(message: string, tipo: 'success' | 'error' = 'success') {
    this.toast = { show: true, message, tipo };
    setTimeout(() => this.toast.show = false, 3500);
  }

  private carregarDados() {
    const userId = this.auth.getUser()?.id;
    if (!userId) return;

    this.ordensService.listarPorCliente(userId).pipe(takeUntil(this.destroy$)).subscribe(d => this.pedidos = d);
    this.atualizarMsgCounts();
    this.chamadosService.listarPorCliente(userId).pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.meusChamados = d.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.atualizarMsgCounts();
    });
    this.equipamentosService.listarPorCliente(userId).pipe(takeUntil(this.destroy$)).subscribe(d => this.meusEquipamentos = d);
  }

  statusClass(s: string): string {
    return s.toLowerCase().replace(/\s+/g, '-');
  }

  chamadoStatusClass(s: string): string {
    return 'ch-status-' + s.toLowerCase().replace(/\s+/g, '-');
  }

  carregarChat() {
    if (!this.chatOrdemId) { this.mensagens = []; return; }
    this.mensagensService.listarPorOrdem(this.chatOrdemId).pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.mensagens = d;
      setTimeout(() => {
        const el = document.querySelector('.chat-msgs');
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    });
  }

  enviarMsg() {
    const texto = this.chatTexto.trim();
    if (!texto || !this.chatOrdemId) return;
    const user = this.auth.getUser();
    if (!user) return;

    const msg: Mensagem = {
      ordemId: this.chatOrdemId,
      remetente: 'cliente',
      remetenteNome: user.nome,
      texto,
      data: new Date().toISOString()
    };

    this.mensagensService.incluir(msg).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.chatTexto = '';
        this.carregarChat();
      },
      error: () => this.mostrarToast('Erro ao enviar mensagem.', 'error')
    });
  }

  abrirChamado() {
    const user = this.auth.getUser();
    if (!user || !this.chamadoForm.descricao.trim()) return;

    const equip = this.meusEquipamentos.find(e => e.id === this.chamadoForm.equipamentoId);
    const chamado: Chamado = {
      clienteId: user.id,
      clienteNome: user.nome,
      equipamentoId: this.chamadoForm.equipamentoId || undefined,
      equipamentoNome: equip ? `${equip.marca} ${equip.modelo}` : undefined,
      descricao: this.chamadoForm.descricao,
      status: 'Aberto',
      data: new Date().toISOString().split('T')[0],
      observacoes: ''
    };

    this.chamadosService.incluir(chamado).pipe(
      takeUntil(this.destroy$),
      switchMap((criado) => {
        this.showChamadoForm = false;
        this.chamadoForm = { equipamentoId: 0, descricao: '' };
        this.mostrarToast(`Chamado #${criado.id} aberto com sucesso! A equipe irá analisar em breve.`);
        return this.chamadosService.listarPorCliente(user.id);
      })
    ).subscribe({
      next: (d) => this.meusChamados = d,
      error: () => this.mostrarToast('Erro ao abrir chamado.', 'error')
    });
  }

  chamadoMsgCount(chamadoId?: number): number {
    return chamadoId ? (this.msgCountMap[chamadoId] ?? 0) : 0;
  }

  onReplyKeydown(e: Event) {
    const ke = e as KeyboardEvent;
    if (ke.shiftKey) return;
    ke.preventDefault();
    this.enviarResposta();
  }

  abrirConversa(ch: Chamado) {
    if (this.chamadoAberto?.id === ch.id) {
      this.chamadoAberto = null;
      this.conversaMensagens = [];
      return;
    }
    this.chamadoAberto = ch;
    this.convReplyTexto = '';
    this.chamadoMsgService.listarPorChamado(ch.id!).pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.conversaMensagens = d.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      setTimeout(() => {
        const el = document.querySelector('.conversa-thread');
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    });
  }

  enviarResposta() {
    const texto = this.convReplyTexto.trim();
    if (!texto || !this.chamadoAberto?.id) return;
    const user = this.auth.getUser();
    if (!user) return;

    this.sendingReply = true;
    const msg: ChamadoMensagem = {
      chamadoId: this.chamadoAberto.id,
      remetente: 'cliente',
      remetenteNome: user.nome,
      texto,
      data: new Date().toISOString()
    };

    this.chamadoMsgService.incluir(msg).pipe(
      takeUntil(this.destroy$),
      switchMap(() => {
        this.convReplyTexto = '';
        return this.chamadoMsgService.listarPorChamado(this.chamadoAberto!.id!);
      })
    ).subscribe({
      next: (d) => {
        this.sendingReply = false;
        this.conversaMensagens = d.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        this.atualizarMsgCounts();
        this.mostrarToast('Resposta enviada com sucesso.');
      },
      error: () => { this.sendingReply = false; this.mostrarToast('Erro ao enviar resposta.', 'error'); }
    });
  }

  private atualizarMsgCounts() {
    this.chamadoMsgService.listarTodas().pipe(takeUntil(this.destroy$)).subscribe(todas => {
      this.msgCountMap = {};
      for (const m of todas) {
        if (m.chamadoId) this.msgCountMap[m.chamadoId] = (this.msgCountMap[m.chamadoId] ?? 0) + 1;
      }
    });
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
