import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChamadosService } from '../../core/services/chamados.service';
import { ChamadoMensagensService } from '../../core/services/chamado-mensagens.service';
import { AuthService } from '../../core/services/auth.service';
import { Chamado, ChamadoMensagem } from '../../core/types/types';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-chamados-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="chamados-crud">
      <div class="crud-bar">
        <button class="btn-primary" (click)="toggleForm()">
          {{ showForm ? 'Cancelar' : '+ Novo Chamado' }}
        </button>
      </div>

      @if (showForm) {
        <div class="form-card">
          <h3>{{ editId ? 'Editar Chamado' : 'Novo Chamado' }}</h3>
          <div class="form-grid">
            <input [(ngModel)]="form.descricao" placeholder="Descrição" class="inp"/>
            <select [(ngModel)]="form.status" class="inp">
              <option value="Aberto">Aberto</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Resolvido">Resolvido</option>
              <option value="Fechado">Fechado</option>
            </select>
            <input [(ngModel)]="form.observacoes" placeholder="Observações" class="inp"/>
          </div>
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

      <!-- Lista de chamados -->
      <div class="consult-card">
        <h3>Chamados</h3>
        <div class="consult-row">
          <input [(ngModel)]="valor" (input)="aplicarFiltros()" placeholder="Buscar chamado..." class="inp"/>
        </div>
      </div>

      <div class="table-wrapper">
        @if (listLoading) {
          <p class="empty">Carregando...</p>
        } @else if (filtrados.length === 0) {
          <p class="empty">Nenhum chamado encontrado.</p>
        } @else {
          <table>
            <thead>
              <tr><th>ID</th><th>Descrição</th><th>Status</th><th>Data</th><th>Ações</th></tr>
            </thead>
            <tbody>
              @for (ch of filtrados; track ch.id) {
                <tr>
                  <td>{{ ch.id }}</td>
                  <td>{{ ch.descricao }}</td>
                  <td><span class="status-badge" [class]="statusClass(ch.status)">{{ ch.status }}</span></td>
                  <td>{{ ch.data }}</td>
                  <td class="actions">
                    <button class="btn-sm btn-blue" (click)="editar(ch)">Editar</button>
                    <button class="btn-sm btn-red" (click)="confirmExcluir(ch)">Excluir</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      @if (sucesso) { <div class="success-msg">{{ sucesso }}</div> }
      @if (!showForm && erroGeral) { <div class="err-msg">{{ erroGeral }}</div> }
      @if (erro) { <p class="err">{{ erro }}</p> }

      <!-- Modal de edição com conversa -->
      @if (editando) {
        <div class="modal-overlay" (click)="editando = null">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Chamado #{{ editando.id }} — {{ editando.descricao }}</h3>
              <button class="modal-close" (click)="editando = null">&times;</button>
            </div>
            <div class="modal-body">
              <div class="edit-status">
                <select [(ngModel)]="form.status" class="inp inp-sm">
                  <option value="Aberto">Aberto</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Resolvido">Resolvido</option>
                  <option value="Fechado">Fechado</option>
                </select>
                <button class="btn-sm btn-primary" [disabled]="saving" (click)="salvarStatus()">
                  {{ saving ? 'Salvando...' : 'Salvar Status' }}
                </button>
              </div>

              <div class="conversa-thread">
                @if (mensagens.length === 0) {
                  <p class="empty">Nenhuma mensagem ainda.</p>
                }
                @for (m of mensagens; track m.id) {
                  <div class="msg" [class.msg-cliente]="m.remetente === 'cliente'" [class.msg-tecnico]="m.remetente !== 'cliente'">
                    <div class="msg-header">
                      <strong>{{ m.remetenteNome }}</strong>
                      <span class="msg-time">{{ m.data | date:'dd/MM HH:mm' }}</span>
                    </div>
                    <p>{{ m.texto }}</p>
                  </div>
                }
              </div>

              <div class="reply-box">
                <textarea [(ngModel)]="replyTexto" placeholder="Responder..." class="inp inp-area" rows="2"></textarea>
                <button class="btn-primary" [disabled]="sendingReply || !replyTexto.trim()" (click)="responder()">
                  {{ sendingReply ? 'Enviando...' : 'Enviar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <app-confirm-dialog
        [show]="confirm.show"
        [title]="confirm.title"
        [text]="confirm.text"
        [loading]="confirm.loading"
        (confirmar)="confirmOk()"
        (cancelar)="confirmCancel()"
      />
    </div>
  `,
  styles: [`
    .chamados-crud { margin-bottom: 24px; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
    .modal-content { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; max-width: 640px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,.5); }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .modal-header h3 { font-size: 1rem; font-weight: 700; color: var(--text); }
    .modal-close { background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
    .modal-close:hover { background: var(--surface-hover); color: var(--text); }
    .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
    .edit-status { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; }
    .conversa-thread { max-height: 300px; overflow-y: auto; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
    .msg { padding: 10px 14px; border-radius: 10px; max-width: 80%; }
    .msg-cliente { align-self: flex-start; background: var(--surface-hover); border: 1px solid var(--border); }
    .msg-tecnico { align-self: flex-end; background: rgba(6,182,212,.1); border: 1px solid rgba(6,182,212,.2); }
    .msg-header { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
    .msg-header strong { font-size: .78rem; color: var(--text); }
    .msg-time { font-size: .7rem; color: var(--text-muted); }
    .msg p { font-size: .85rem; color: var(--text); margin: 0; }
    .reply-box { display: flex; gap: 10px; align-items: flex-end; }
    .reply-box .btn-primary { white-space: nowrap; }
  `]
})
export class ChamadosCrudComponent implements OnDestroy, OnInit {
  chamados: Chamado[] = [];
  filtrados: Chamado[] = [];
  editando: Chamado | null = null;
  saving = false;
  sendingReply = false;
  replyTexto = '';
  listLoading = false;
  valor = '';
  erro = '';
  sucesso = '';
  erroGeral = '';
  showForm = false;
  editId: number | null = null;
  loading = false;
  mensagens: ChamadoMensagem[] = [];
  form: { descricao: string; status: string; observacoes: string } = { descricao: '', status: 'Aberto', observacoes: '' };
  confirm = { show: false, title: '', text: '', loading: false, item: null as Chamado | null };
  _timeoutId: number | undefined;
  destroy$ = new Subject<void>();

  constructor(
    private service: ChamadosService,
    private msgService: ChamadoMensagensService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this._timeoutId !== undefined) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }
  }

  listar(): void {
    this.listLoading = true;
    this.service.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Chamado[]) => {
        this.chamados = data.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        this.aplicarFiltros();
        this.listLoading = false;
        this.cdr.detectChanges();
      }, () => {
        this.erroGeral = 'Erro ao carregar chamados.';
        this.listLoading = false;
        this.cdr.detectChanges();
      });
  }

  aplicarFiltros(): void {
    let base = [...this.chamados];
    if (this.valor) {
      base = base.filter(ch => Object.values(ch).some(v => String(v).toLowerCase().includes(this.valor.toLowerCase())));
    }
    this.filtrados = base;
    this.cdr.detectChanges();
  }

  carregarMensagens(chamadoId: number): void {
    this.msgService.listarPorChamado(chamadoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((msgs: ChamadoMensagem[]) => {
        this.mensagens = msgs.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        this.cdr.detectChanges();
        setTimeout(() => {
          const el = document.querySelector('.conversa-thread');
          if (el) el.scrollTop = el.scrollHeight;
        }, 50);
      }, () => {
        this.erro = 'Erro ao carregar mensagens.';
        this.cdr.detectChanges();
      });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.editId = null;
    this.form = { descricao: '', status: 'Aberto', observacoes: '' };
    this.sucesso = '';
    this.erroGeral = '';
  }

  cancelar(): void {
    this.showForm = false;
    this.editId = null;
    this.form = { descricao: '', status: 'Aberto', observacoes: '' };
    this.sucesso = '';
    this.erroGeral = '';
  }

  salvar(): void {
    if (!this.form.descricao) {
      this.erroGeral = 'Descrição é obrigatória.';
      return;
    }
    this.loading = true;
    this.erroGeral = '';
    const payload: Partial<Chamado> = {
      descricao: this.form.descricao,
      status: (this.form.status || 'Aberto') as 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado',
      observacoes: this.form.observacoes || '',
      data: new Date().toISOString(),
    };
    const op = this.editId
      ? this.service.editar({ ...payload, id: this.editId } as Chamado)
      : this.service.incluir(payload as Chamado);

    op.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loading = false;
      this.cancelar();
      this.sucesso = 'Chamado salvo.';
      this.cdr.detectChanges();
      setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000);
      this.listar();
    }, () => {
      this.loading = false;
      this.erroGeral = 'Erro ao salvar.';
      this.cdr.detectChanges();
    });
  }

  editar(ch: Chamado): void {
    this.editando = ch;
    this.form.status = (ch.status || 'Aberto') as 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado';
    this.replyTexto = '';
    this.carregarMensagens(ch.id!);
    setTimeout(() => {
      const el = document.querySelector('.conversa-thread');
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  confirmExcluir(ch: Chamado): void {
    if (!ch || !ch.id) return;
    this.confirm = {
      show: true,
      title: 'Excluir Chamado',
      text: `Excluir chamado #${ch.id}?`,
      loading: false,
      item: ch,
    };
  }

  confirmOk(): void {
    const ch = this.confirm.item;
    if (!ch || !ch.id) return;
    this.confirm.loading = true;
    this.service.excluir(ch.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.confirm = { show: false, title: '', text: '', loading: false, item: null };
        this.sucesso = 'Chamado excluído.';
        this.cdr.detectChanges();
        setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000);
        this.listar();
      }, () => {
        this.confirm.show = false;
        this.erroGeral = 'Erro ao excluir chamado.';
        this.cdr.detectChanges();
      });
  }

  confirmCancel(): void {
    this.confirm = { show: false, title: '', text: '', loading: false, item: null };
  }

  statusClass(s: string): string {
    return 'status-' + s.toLowerCase().replace(/\s+/g, '-');
  }

  responder() {
    const texto = this.replyTexto.trim();
    if (!texto || !this.editando?.id) return;
    const user = this.auth.getUser();
    if (!user) return;

    this.sendingReply = true;
    const msg: ChamadoMensagem = {
      chamadoId: this.editando.id,
      remetente: user.papel as 'tecnico' | 'gerente',
      remetenteNome: user.nome,
      texto,
      data: new Date().toISOString(),
    };

    this.msgService.incluir(msg).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.replyTexto = '';
        this.sendingReply = false;
        this.carregarMensagens(this.editando!.id!);
        this.sucesso = 'Resposta enviada.';
        this.cdr.detectChanges();
        setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.erro = 'Erro ao enviar resposta.';
        this.sendingReply = false;
        this.cdr.detectChanges();
      }
    });
  }

  salvarStatus() {
    if (!this.editando?.id) return;
    this.saving = true;
    this.erro = '';
    const payload: Chamado = {
      ...this.editando,
      status: (this.form.status || 'Aberto') as 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado',
      observacoes: this.form.observacoes || '',
    };

    this.service.editar(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.saving = false;
        this.sucesso = `Chamado #${payload.id} atualizado para "${payload.status}".`;
        this.cdr.detectChanges();
        setTimeout(() => { this.sucesso = ''; this.cdr.detectChanges(); }, 3000);
        this.listar();
      },
      error: () => {
        this.saving = false;
        this.erro = 'Erro ao salvar chamado.';
        this.cdr.detectChanges();
      }
    });
  }
}