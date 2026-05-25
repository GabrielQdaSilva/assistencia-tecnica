import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show) {
      <div class="modal-overlay" (click)="cancelar.emit()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-icon" [class]="tipo === 'danger' ? 'icon-danger' : 'icon-warn'">
            @if (tipo === 'danger') {
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            } @else {
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            }
          </div>
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-text">{{ text }}</p>
          <div class="modal-actions">
            <button class="btn-sec" (click)="cancelar.emit()">{{ btnCancel }}</button>
            <button class="btn-danger" [disabled]="loading" (click)="confirmar.emit()">
              @if (loading) {
                <span class="spinner-sm"></span> {{ btnLoading }}
              } @else {
                {{ btnConfirm }}
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
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
    .icon-danger { color: var(--danger); }
    .icon-warn { color: #fbbf24; }
    .modal-title { font-size: 1.15rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .modal-text { font-size: .9rem; color: var(--text-muted); margin-bottom: 24px; }
    .modal-actions { display: flex; gap: 10px; justify-content: center; }
    .btn-sec {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; background: var(--surface-hover); color: var(--text);
      border: none; border-radius: 8px; font-size: .9rem; font-weight: 500;
      cursor: pointer; transition: all .2s;
    }
    .btn-sec:hover { background: var(--border); }
    .btn-danger {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; background: var(--danger); color: #fff;
      border: none; border-radius: 8px; font-size: .9rem; font-weight: 600;
      cursor: pointer; transition: all .2s;
    }
    .btn-danger:hover { background: var(--danger-hover); transform: translateY(-1px); }
    .btn-danger:disabled { opacity: .5; cursor: not-allowed; transform: none; }
    .spinner-sm {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ConfirmDialogComponent {
  @Input() show = false;
  @Input() title = 'Confirmar';
  @Input() text = '';
  @Input() tipo: 'danger' | 'warn' = 'danger';
  @Input() loading = false;
  @Input() btnConfirm = 'Confirmar';
  @Input() btnCancel = 'Cancelar';
  @Input() btnLoading = 'Aguarde...';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
