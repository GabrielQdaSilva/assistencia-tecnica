import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrdensService } from '../../core/services/ordens.service';
import { ClientesService } from '../../core/services/clientes.service';
import { EquipamentosService } from '../../core/services/equipamentos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing">

      <!-- Hero -->
      <section class="hero" id="inicio">
        <div class="hero-inner">
          <div class="hero-grid">
            <div class="hero-text">
              <h1>Seu dispositivo novo de novo. <span class="accent">Manutenção rápida e de confiança.</span></h1>
              <p class="hero-sub">Especialistas em eletrônicos em geral. Se liga na tomada, é da nossa área!</p>
              <p class="hero-desc">Smartphones, notebooks, desktops, TVs, monitores, impressoras e muito mais.</p>
              <a class="btn-cta" routerLink="/login">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                Falar com um Técnico agora
              </a>
            </div>
            <div class="hero-visual">
              <div class="hero-box">
                <svg width="200" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity=".15" style="width:100%;height:auto;"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>
              </div>
              <div class="hero-float-icon left">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <div class="hero-float-icon right">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="stats">
        <div class="section-inner">
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
        </div>
      </section>

      <!-- Services -->
      <section class="section" id="servicos">
        <div class="section-inner">
          <div class="section-header">
            <h2>Nossos Serviços</h2>
            <p>Soluções completas para todos os seus aparelhos eletrônicos</p>
            <p class="section-tagline">"Ligou na tomada? Nós consertamos!"</p>
          </div>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <h3>Smartphones & Tablets</h3>
              <p>Troca de tela, bateria, conectores e reparo de placa.</p>
            </div>
            <div class="service-card">
              <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg></div>
              <h3>Notebooks Corporativos e Gamers</h3>
              <p>Limpeza preventiva, troca de pasta térmica, reparos em carcaça e diagnóstico completo.</p>
            </div>
            <div class="service-card">
              <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
              <h3>Upgrades de Hardware</h3>
              <p>Instalação de SSDs, configuração de memória RAM em Dual Channel e otimização de sistema operacional.</p>
            </div>
            <div class="service-card">
              <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M2 12h20"/><path d="M12 2v20"/></svg></div>
              <h3>Montagem de Desktops</h3>
              <p>Consultoria e montagem de computadores para trabalho pesado ou jogos.</p>
            </div>
          </div>
          <div class="services-banner">
            <h3>E muito mais!</h3>
            <p>TVs, monitores, impressoras, roteadores, fontes, consoles, equipamentos de áudio, periféricos e qualquer aparelho eletrônico que você precisar.</p>
            <strong>Se liga na tomada, nós consertamos!</strong>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features" id="sobre">
        <div class="section-inner">
          <div class="section-header">
            <h2>Por que nos escolher?</h2>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
              <h3>Diagnóstico Preciso</h3>
              <p>Sem enrolação. Identificamos o problema real e apresentamos a solução mais adequada.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <h3>Peças de Qualidade</h3>
              <p>Utilizamos apenas componentes certificados com garantia completa no serviço.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
              <h3>Rapidez</h3>
              <p>Seu aparelho pronto no menor tempo possível, sem comprometer a qualidade.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Reviews -->
      <section class="section reviews-section" id="avaliacoes">
        <div class="section-inner">
          <div class="section-header">
            <h2>O que nossos clientes dizem</h2>
            <p>Veja a opinião de quem já usou nossos serviços</p>
          </div>
          <div class="reviews-grid">
            <div class="review-card">
              <div class="review-stars">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p class="review-text">"Levei meu celular com a tela quebrada e em 2 dias estava pronto. Preço justo e serviço impecável. Super recomendo!"</p>
              <div class="review-author">
                <div class="review-avatar" style="background:#3b82f6;">C</div>
                <div>
                  <strong>Carlos Oliveira</strong>
                  <span>Smartphone — Troca de Tela</span>
                </div>
              </div>
            </div>
            <div class="review-card">
              <div class="review-stars">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p class="review-text">"Notebook não ligava mais. Diagnosticaram rápido, trocaram a fonte e ficou zero. Atendimento nota 10!"</p>
              <div class="review-author">
                <div class="review-avatar" style="background:#8b5cf6;">A</div>
                <div>
                  <strong>Ana Silva</strong>
                  <span>Notebook — Reparo de Fonte</span>
                </div>
              </div>
            </div>
            <div class="review-card">
              <div class="review-stars">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p class="review-text">"Instalei um SSD no meu PC e ficou um novo. Instalação rápida e limpa, sem firula. Preço ótimo pelo serviço."</p>
              <div class="review-author">
                <div class="review-avatar" style="background:#10b981;">R</div>
                <div>
                  <strong>Rafael Costa</strong>
                  <span>Desktop — Instalação de SSD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer" id="contato">
        <div class="section-inner">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="footer-logo" routerLink="/">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                Prime <span class="accent">Assistência</span>
              </a>
              <p>Assistência técnica especializada em eletrônicos com qualidade e garantia.</p>
            </div>
            <div class="footer-contact-col">
              <h4>Contato</h4>
              <div class="fcontact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Rua das Tecnologias, 1234 — Centro, São Paulo - SP</span>
              </div>
              <div class="fcontact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>(11) 98765-4321</span>
              </div>
              <div class="fcontact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>contato&#64;primeassistencia.com.br</span>
              </div>
            </div>
            <div class="footer-hours">
              <h4>Horário de Funcionamento</h4>
              <p>Segunda a Sexta: 09h às 18h<br>Sábados e Domingos: Fechado</p>
              <div class="footer-social">
                <a href="#" aria-label="Facebook">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 Prime Assistência. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    .landing { width: 100%; }

    .hero {
      padding: 120px 24px 80px;
      background: linear-gradient(135deg, var(--bg) 0%, rgba(11,17,32,.95) 100%);
      overflow: hidden;
      position: relative;
    }
    .hero::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(6,182,212,.06) 0%, transparent 60%);
      pointer-events: none;
    }
    .hero-inner { max-width: 1120px; margin: 0 auto; position: relative; z-index: 1; }
    .hero-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 60px; align-items: center;
    }
    .hero-text h1 { font-size: var(--text-4xl); font-weight: 800; color: var(--text); line-height: 1.15; letter-spacing: -.03em; margin-bottom: var(--space-5); }
    .hero-text .accent { color: var(--primary); }
    .hero-sub { font-size: var(--text-lg); color: var(--text-muted); margin-bottom: var(--space-2); }
    .hero-desc { font-size: var(--text-md); color: var(--text-muted); opacity: .75; margin-bottom: var(--space-8); }
    .btn-cta {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 32px; font-size: var(--text-base); font-weight: 600;
      border-radius: var(--radius-md); text-decoration: none; cursor: pointer;
      background: var(--primary); color: #fff; border: none;
      transition: all var(--transition-slow); box-shadow: 0 4px 20px rgba(6,182,212,.25);
    }
    .btn-cta:hover { background: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(6,182,212,.35); }
    .btn-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
    .btn-cta:active { transform: translateY(0); }

    .hero-visual { position: relative; }
    .hero-box {
      background: linear-gradient(135deg, var(--primary), #0e7490);
      border-radius: var(--radius-xl); padding: 40px;
      transform: rotate(1deg); transition: transform .4s ease;
    }
    .hero-box:hover { transform: rotate(0deg); }
    .hero-float-icon {
      position: absolute; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-md); padding: var(--space-3); box-shadow: var(--shadow);
      animation: float 6s ease-in-out infinite;
    }
    .hero-float-icon.left { top: 16px; left: -16px; animation-delay: 0s; }
    .hero-float-icon.right { bottom: 32px; right: -16px; animation-delay: 3s; }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .stats {
      padding: 36px 24px; background: var(--surface);
      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    }
    .section-inner { max-width: 1120px; margin: 0 auto; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); text-align: center; }
    .stat-item { padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--border); transition: all var(--transition-slow); }
    .stat-item:hover { border-color: rgba(6,182,212,.2); transform: translateY(-2px); box-shadow: var(--shadow); }
    .stat-num { font-size: var(--text-2xl); font-weight: 800; color: var(--primary); }
    .stat-label { font-size: var(--text-sm); color: var(--text-muted); }

    .section { padding: var(--space-16) 24px; }
    .section:nth-child(even) { background: var(--surface); }
    .section-header { text-align: center; margin-bottom: var(--space-12); }
    .section-header h2 { font-size: var(--text-3xl); font-weight: 800; color: var(--text); margin-bottom: var(--space-3); }
    .section-header p { color: var(--text-muted); font-size: var(--text-lg); max-width: 540px; margin: 0 auto; }
    .section-tagline { color: var(--text-muted); font-size: var(--text-base); margin-top: var(--space-2); font-style: italic; }

    .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); }
    .service-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: var(--space-6);
      transition: all var(--transition-slow);
    }
    .service-card:hover { border-color: rgba(6,182,212,.25); transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .service-icon {
      width: 52px; height: 52px; border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--primary), #0e7490);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: var(--space-4);
    }
    .service-card h3 { font-size: var(--text-lg); font-weight: 700; color: var(--text); margin-bottom: var(--space-2); }
    .service-card p { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; }

    .services-banner {
      margin-top: 36px;
      background: linear-gradient(135deg, var(--primary), #0e7490);
      border-radius: var(--radius-xl); padding: var(--space-8) var(--space-10); text-align: center; color: #fff;
    }
    .services-banner h3 { font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-2); }
    .services-banner p { font-size: var(--text-md); opacity: .9; max-width: 720px; margin: 0 auto var(--space-3); line-height: 1.6; }
    .services-banner strong { font-size: var(--text-lg); }

    .features {
      padding: var(--space-16) 24px;
      background: linear-gradient(135deg, var(--primary), #0e7490);
      color: #fff;
    }
    .features .section-header h2 { color: #fff; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-10); }
    .feature-card { text-align: center; }
    .feature-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255,255,255,.12);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto var(--space-5);
      transition: transform var(--transition-slow);
    }
    .feature-card:hover .feature-icon { transform: scale(1.1); }
    .feature-card h3 { font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-3); }
    .feature-card p { font-size: var(--text-md); opacity: .8; line-height: 1.6; max-width: 300px; margin: 0 auto; }

    .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
    .review-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 28px; transition: all var(--transition-slow);
      display: flex; flex-direction: column;
    }
    .review-card:hover { border-color: rgba(6,182,212,.2); transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .review-stars { display: flex; gap: 2px; margin-bottom: var(--space-4); }
    .review-text { font-size: var(--text-sm); color: var(--text); line-height: 1.7; flex: 1; margin-bottom: var(--space-5); font-style: italic; }
    .review-author { display: flex; align-items: center; gap: var(--space-3); }
    .review-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: var(--text-base); flex-shrink: 0;
    }
    .review-author strong { display: block; font-size: var(--text-sm); color: var(--text); }
    .review-author span { font-size: var(--text-xs); color: var(--text-muted); }

    .footer {
      padding: var(--space-16) 24px 36px;
      background: linear-gradient(180deg, var(--surface) 0%, #0d0d14 100%);
      border-top: 1px solid var(--border);
    }
    .footer-grid { display: grid; grid-template-columns: 1.4fr 1.2fr 1.4fr; gap: 48px; margin-bottom: 36px; }
    .footer-logo { display: flex; align-items: center; gap: 10px; font-size: var(--text-lg); font-weight: 700; color: var(--text); text-decoration: none; margin-bottom: var(--space-4); }
    .footer-logo .accent { color: var(--primary); }
    .footer-brand p { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; max-width: 300px; }
    .footer h4 { font-size: var(--text-sm); font-weight: 700; color: var(--text); margin-bottom: var(--space-4); text-transform: uppercase; letter-spacing: .08em; }
    .fcontact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: var(--space-3); font-size: var(--text-sm); color: var(--text-muted); }
    .fcontact-item svg { flex-shrink: 0; margin-top: 2px; }
    .footer-hours p { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.7; margin-bottom: var(--space-5); }
    .footer-social { display: flex; gap: 10px; }
    .footer-social a {
      width: 40px; height: 40px; border-radius: var(--radius);
      background: var(--surface); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); text-decoration: none;
      transition: all var(--transition);
    }
    .footer-social a:hover { background: var(--primary); color: #fff; border-color: var(--primary); transform: translateY(-2px); }
    .footer-bottom { border-top: 1px solid var(--border); padding-top: var(--space-6); text-align: center; font-size: var(--text-sm); color: var(--text-muted); }

    /* ===== Responsive ===== */
    @media (max-width: 1024px) {
      .hero { padding: 100px 24px 60px; }
      .hero-text h1 { font-size: 2.2rem; }
    }
    @media (max-width: 860px) {
      .hero-grid { grid-template-columns: 1fr; gap: 40px; }
      .hero-visual { max-width: 400px; margin: 0 auto; }
      .hero-text { text-align: center; }
      .hero-text h1 { font-size: 2rem; }
      .services-grid { grid-template-columns: repeat(2, 1fr); }
      .reviews-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    }
    @media (max-width: 640px) {
      .hero { padding: 80px 16px 48px; }
      .hero-text h1 { font-size: 1.7rem; }
      .hero-sub { font-size: var(--text-base); }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .features-grid { grid-template-columns: 1fr; }
      .section { padding: var(--space-12) 16px; }
      .features { padding: var(--space-12) 16px; }
      .services-grid { gap: var(--space-4); }
      .services-banner { padding: var(--space-6); }
      .footer { padding: var(--space-12) 16px 24px; }
    }
    @media (max-width: 480px) {
      .hero { padding: 64px 16px 40px; }
      .hero-text h1 { font-size: 1.4rem; }
      .btn-cta { width: 100%; justify-content: center; }
      .stats-grid { gap: var(--space-3); }
      .stat-item { padding: var(--space-3); }
      .stat-num { font-size: var(--text-xl); }
      .services-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  stats = {
    totalOS: 0,
    clientesAtivos: 0,
    equipamentos: 0,
    receita: 0
  };

  constructor(
    private ordensService: OrdensService,
    private clientesService: ClientesService,
    private equipamentosService: EquipamentosService
  ) {}

  ngOnInit() {
    this.carregarStats();
  }

  private carregarStats() {
    this.ordensService.listar().pipe(takeUntil(this.destroy$)).subscribe(ordens => {
      this.stats.totalOS = ordens.length;
      this.stats.receita = ordens
        .filter(o => (o.status === 'Pronto' || o.status === 'Entregue') && o.valorTotal)
        .reduce((acc, o) => acc + (o.valorTotal ?? 0), 0);
    });
    this.clientesService.listar().pipe(takeUntil(this.destroy$)).subscribe(c => {
      this.stats.clientesAtivos = c.filter(c => c.ativo).length;
    });
    this.equipamentosService.listar().pipe(takeUntil(this.destroy$)).subscribe(e => {
      this.stats.equipamentos = e.length;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
