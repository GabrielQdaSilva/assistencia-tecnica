import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FuncionariosCrudComponent } from '../../components/crud/funcionarios-crud.component';
import { ClientesCrudComponent } from '../../components/crud/clientes-crud.component';
import { EquipamentosCrudComponent } from '../../components/crud/equipamentos-crud.component';
import { EstoqueCrudComponent } from '../../components/crud/estoque-crud.component';
import { OrdensService } from '../../core/services/ordens.service';
import { ClientesService } from '../../core/services/clientes.service';
import { EquipamentosService } from '../../core/services/equipamentos.service';
import { OrdemServico } from '../../core/types/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FuncionariosCrudComponent, ClientesCrudComponent, EquipamentosCrudComponent, EstoqueCrudComponent],
  template: `
    <div class="landing">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-badge">Especialistas em Reparos</div>
          <h1>Prime <span class="accent">Assistência</span></h1>
          <p class="hero-sub">Seu dispositivo funcionando como novo. Rapidez e qualidade em cada reparo.</p>
          <p class="hero-desc">Smartphones, notebooks, desktops, tablets e muito mais. Orçamento sem compromisso.</p>
          <div class="hero-actions">
            <a class="btn-primary-lg" routerLink="/area-tecnico">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Área do Técnico
            </a>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="stats">
        <div class="section-inner">
          <div class="stats-grid">
            <div class="stat-item stat-dynamic">
              <span class="stat-num">{{ stats.totalOS }}</span>
              <span class="stat-label">Ordens de Serviço</span>
            </div>
            <div class="stat-item stat-dynamic">
              <span class="stat-num">{{ stats.clientesAtivos }}</span>
              <span class="stat-label">Clientes Ativos</span>
            </div>
            <div class="stat-item stat-dynamic">
              <span class="stat-num">{{ stats.equipamentos }}</span>
              <span class="stat-label">Equipamentos</span>
            </div>
            <div class="stat-item stat-dynamic">
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
            <p>Soluções completas para seus equipamentos eletrônicos</p>
          </div>
          <div class="services-grid">
            <div class="service-card">
              <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop');">
                <div class="card-img-overlay"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <h3>Smartphones & Tablets</h3>
              <p>Troca de tela, bateria, conector de carga, reparo em placa, câmera e muito mais.</p>
              <span class="service-price">A partir de R$ 79</span>
            </div>
            <div class="service-card">
              <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop');">
                <div class="card-img-overlay"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
              </div>
              <h3>Notebooks</h3>
              <p>Limpeza preventiva, troca de pasta térmica, reparo em carcaça, tela e teclado.</p>
              <span class="service-price">A partir de R$ 149</span>
            </div>
            <div class="service-card">
              <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1593640495253-23108b86e77b?w=400&h=300&fit=crop');">
                <div class="card-img-overlay"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3>Desktops & PCs</h3>
              <p>Montagem, upgrade, instalação de SSD, formatação, limpeza e otimização.</p>
              <span class="service-price">A partir de R$ 99</span>
            </div>
            <div class="service-card">
              <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1605901309584-7bd056f6a7eb?w=400&h=300&fit=crop');">
                <div class="card-img-overlay"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>
              </div>
              <h3>Consoles</h3>
              <p>Reparo de PlayStation, Xbox e Nintendo Switch. Limpeza e manutenção de controles.</p>
              <span class="service-price">A partir de R$ 129</span>
            </div>
            <div class="service-card">
              <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1586210579198-33b0d8c4bd61?w=400&h=300&fit=crop');">
                <div class="card-img-overlay"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3>TVs & Monitores</h3>
              <p>Reparo de fonte, troca de tela, problemas de imagem e conexões.</p>
              <span class="service-price">A partir de R$ 119</span>
            </div>
            <div class="service-card">
              <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop');">
                <div class="card-img-overlay"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3>Outros Equipamentos</h3>
              <p>Impressoras, roteadores, fontes, periféricos e equipamentos de áudio.</p>
              <span class="service-price">Sob consulta</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Price Table -->
      <section class="section price-section" id="precos">
        <div class="section-inner">
          <div class="section-header">
            <h2>Tabela de Preços</h2>
            <p>Principais serviços com valores referenciais</p>
          </div>
          <div class="price-table-wrap">
            <table class="price-table">
              <thead>
                <tr><th>Serviço</th><th>Descrição</th><th>Valor</th></tr>
              </thead>
              <tbody>
                <tr><td>Troca de tela (smartphone)</td><td>Tela original e substituição</td><td class="price-val">R$ 179</td></tr>
                <tr><td>Troca de bateria</td><td>Bateria original + mão de obra</td><td class="price-val">R$ 129</td></tr>
                <tr><td>Limpeza preventiva (notebook)</td><td>Limpeza interna + troca pasta térmica</td><td class="price-val">R$ 149</td></tr>
                <tr><td>Instalação de SSD</td><td>SSD 240GB + instalação + sistema</td><td class="price-val">R$ 289</td></tr>
                <tr><td>Formatação / reinstalação</td><td>Backup + formatação + drivers</td><td class="price-val">R$ 99</td></tr>
                <tr><td>Reparo de conector de carga</td><td>Solda e substituição do conector</td><td class="price-val">R$ 89</td></tr>
                <tr><td>Troca de tela (notebook)</td><td>Tela compatível + instalação</td><td class="price-val">R$ 249</td></tr>
                <tr><td>Diagnóstico completo</td><td>Análise detalhada do equipamento</td><td class="price-val">Grátis</td></tr>
              </tbody>
            </table>
          </div>
          <p class="price-note">* Valores podem variar conforme modelo e disponibilidade de peças. Orçamento oficial mediante avaliação.</p>
        </div>
      </section>

      <!-- How it works -->
      <section class="section how-section">
        <div class="section-inner">
          <div class="section-header">
            <h2>Como Funciona</h2>
            <p>Processo simples e transparente em 3 etapas</p>
          </div>
          <div class="how-grid">
            <div class="how-step">
              <div class="how-num">1</div>
              <div class="how-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3>Diagnóstico</h3>
              <p>Você nos conta o problema ou traz o aparelho. Fazemos uma análise completa e identificamos a causa.</p>
            </div>
            <div class="how-step">
              <div class="how-num">2</div>
              <div class="how-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3>Orçamento</h3>
              <p>Apresentamos o diagnóstico, explicamos o reparo necessário e informamos o valor. Sem surpresas.</p>
            </div>
            <div class="how-step">
              <div class="how-num">3</div>
              <div class="how-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3>Reparo</h3>
              <p>Autorizou? Executamos o serviço com peças de qualidade e devolvemos seu aparelho funcionando.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why -->
      <section class="section why-section">
        <div class="section-inner">
          <div class="section-header">
            <h2>Por que nos escolher?</h2>
          </div>
          <div class="why-grid">
            <div class="why-card">
              <div class="why-icon" style="background: rgba(59,130,246,.1);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Garantia</h3>
              <p>Todo serviço tem garantia de até 3 meses. Sua tranquilidade é nossa prioridade.</p>
            </div>
            <div class="why-card">
              <div class="why-icon" style="background: rgba(59,130,246,.1);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"/><path d="M5 11v3a7 7 0 0 0 14 0v-3"/></svg>
              </div>
              <h3>Peças Originais</h3>
              <p>Trabalhamos com peças certificadas e compatíveis para garantir o melhor resultado.</p>
            </div>
            <div class="why-card">
              <div class="why-icon" style="background: rgba(59,130,246,.1);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3>Rapidez</h3>
              <p>Diagnóstico rápido e reparo ágil. A maioria dos serviços fica pronto em até 48h.</p>
            </div>
            <div class="why-card">
              <div class="why-icon" style="background: rgba(59,130,246,.1);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><path d="M5 7v14h14V7"/><path d="M3 7h18"/></svg>
              </div>
              <h3>Orçamento Grátis</h3>
              <p>Diagnóstico sem compromisso. Você só paga se autorizar o serviço.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Gerenciamento CRUD -->
      <section class="section crud-section" id="gerenciamento">
        <div class="section-inner">
          <div class="section-header">
            <h2>Gerenciamento</h2>
            <p>Cadastre, consulte, altere e exclua registros de funcionários e clientes</p>
          </div>

          <div class="tabs">
            <button class="tab" [class.active]="activeTab === 'funcionarios'" (click)="activeTab = 'funcionarios'">Funcionários</button>
            <button class="tab" [class.active]="activeTab === 'clientes'" (click)="activeTab = 'clientes'">Clientes</button>
            <button class="tab" [class.active]="activeTab === 'equipamentos'" (click)="activeTab = 'equipamentos'">Equipamentos</button>
            <button class="tab" [class.active]="activeTab === 'estoque'" (click)="activeTab = 'estoque'">Estoque</button>
          </div>

          @if (activeTab === 'funcionarios') {
            <app-funcionarios-crud/>
          } @else if (activeTab === 'clientes') {
            <app-clientes-crud/>
          } @else if (activeTab === 'equipamentos') {
            <app-equipamentos-crud/>
          } @else if (activeTab === 'estoque') {
            <app-estoque-crud/>
          }
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="section-inner">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  <span>Prime <span class="accent">Assistência</span></span>
              </div>
              <p class="footer-desc">Prime Assistência — especializada em reparos de eletrônicos. Qualidade e confiança desde 2024.</p>
              <div class="footer-social">
                <a href="https://instagram.com" target="_blank" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4>Serviços</h4>
              <a (click)="scrollPara('servicos')">Smartphones & Tablets</a>
              <a (click)="scrollPara('servicos')">Notebooks</a>
              <a (click)="scrollPara('servicos')">Desktops & PCs</a>
              <a (click)="scrollPara('servicos')">Consoles</a>
              <a (click)="scrollPara('servicos')">TVs & Monitores</a>
            </div>
            <div>
              <h4>Gerenciamento</h4>
              <a routerLink="/area-tecnico">Área do Técnico</a>
              <a (click)="scrollPara('gerenciamento'); activeTab='funcionarios'">Funcionários</a>
              <a (click)="scrollPara('gerenciamento'); activeTab='clientes'">Clientes</a>
            </div>
            <div>
              <h4>Contato</h4>
              <span class="footer-contact">(11) 99999-9999</span>
              <span class="footer-contact">contato&#64;assistenciatecnica.com.br</span>
              <span class="footer-hours-title">Horário</span>
              <span>Seg a Sex: 09h — 18h</span>
              <span>Sáb: 09h — 13h</span>
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
      position: relative; overflow: hidden;
      padding: 140px 24px 120px; text-align: center;
      background: #0a0a12;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1400&h=800&fit=crop') center/cover;
      opacity: .25;
      pointer-events: none;
    }
    .hero-bg::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(10,10,18,.85) 0%, rgba(10,10,18,.6) 50%, rgba(10,10,18,.9) 100%);
    }
    .hero-content { position: relative; max-width: 720px; margin: 0 auto; }
    .hero-badge {
      display: inline-block; padding: 8px 20px; margin-bottom: 24px;
      background: linear-gradient(135deg, rgba(59,130,246,.15), rgba(59,130,246,.05));
      color: var(--primary); font-size: .8rem; font-weight: 600;
      border-radius: 20px; letter-spacing: .03em;
      border: 1px solid rgba(59,130,246,.15);
    }
    h1 { font-size: 3rem; font-weight: 800; color: var(--text); margin-bottom: 16px; letter-spacing: -.03em; line-height: 1.1; }
    .hero-sub { font-size: 1.2rem; color: var(--text-muted); margin-bottom: 8px; }
    .hero-desc { font-size: 1rem; color: var(--text-muted); opacity: .75; margin-bottom: 40px; }
    .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .btn-primary-lg {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 32px; font-size: 1rem; font-weight: 600;
      border-radius: 12px; text-decoration: none; cursor: pointer;
      background: linear-gradient(135deg, var(--primary), #6366f1);
      color: #fff; border: none;
      transition: all .25s; box-shadow: 0 4px 20px rgba(59,130,246,.25);
    }
    .btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(59,130,246,.35); }

    .stats {
      padding: 36px 24px; background: var(--surface);
      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center; }
    .stat-item { display: flex; flex-direction: column; gap: 6px; padding: 8px 0; }
    .stat-num { font-size: 1.4rem; font-weight: 800; color: var(--primary); }
    .stat-label { font-size: .8rem; color: var(--text-muted); }
    .stat-dynamic {
      padding: 16px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(59,130,246,.04), rgba(99,102,241,.02));
      border: 1px solid rgba(59,130,246,.08);
      transition: all .3s;
    }
    .stat-dynamic:hover { border-color: rgba(59,130,246,.2); transform: translateY(-2px); background: linear-gradient(135deg, rgba(59,130,246,.08), rgba(99,102,241,.04)); }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

    .section { padding: 96px 24px; }
    .section:nth-child(even) { background: var(--surface); }
    .section-inner { max-width: 1120px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 56px; }
    .section-header h2 { font-size: 2rem; font-weight: 800; color: var(--text); margin-bottom: 12px; letter-spacing: -.02em; }
    .section-header p { color: var(--text-muted); font-size: 1.05rem; max-width: 540px; margin: 0 auto; }

    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .service-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; overflow: hidden;
      transition: all .3s cubic-bezier(.4,0,.2,1);
      position: relative;
    }
    .service-card::before {
      content: ''; position: absolute; inset: 0;
      border-radius: 16px; opacity: 0;
      background: linear-gradient(180deg, rgba(59,130,246,.03) 0%, transparent 100%);
      transition: opacity .3s;
      pointer-events: none;
    }
    .service-card:hover {
      border-color: rgba(59,130,246,.3); transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,.3);
    }
    .service-card:hover::before { opacity: 1; }
    .card-img {
      height: 140px; display: flex; align-items: center; justify-content: center;
      background-size: cover; background-position: center;
      position: relative; overflow: hidden;
    }
    .card-img-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(10,10,18,.3) 0%, rgba(10,10,18,.7) 100%);
    }
    .card-img svg { position: relative; z-index: 1; filter: drop-shadow(0 2px 8px rgba(0,0,0,.4)); }
    .service-card:hover .card-img { transform: scale(1.02); }
    .service-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--text); padding: 20px 24px 8px; }
    .service-card p { font-size: .85rem; color: var(--text-muted); line-height: 1.6; padding: 0 24px; }
    .service-price { display: block; padding: 14px 24px 20px; font-size: .95rem; font-weight: 700; color: var(--primary); }

    .price-section { background: var(--surface); }
    .price-table-wrap { overflow-x: auto; max-width: 720px; margin: 0 auto; }
    .price-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: .88rem; overflow: hidden; border-radius: 12px; border: 1px solid var(--border); }
    .price-table thead tr { background: linear-gradient(135deg, rgba(59,130,246,.12), rgba(59,130,246,.04)); }
    .price-table th { color: var(--text); font-weight: 700; font-size: .78rem; text-transform: uppercase; letter-spacing: .06em; padding: 16px 20px; text-align: left; }
    .price-table td { padding: 14px 20px; color: var(--text); border-top: 1px solid var(--border); }
    .price-table tbody tr { transition: background .2s; }
    .price-table tbody tr:hover { background: var(--surface-hover); }
    .price-val { font-weight: 700; color: var(--primary); white-space: nowrap; text-align: right; }
    .price-note { text-align: center; color: var(--text-muted); font-size: .8rem; margin-top: 24px; }

    .how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
    .how-step {
      text-align: center; padding: 40px 28px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; position: relative;
      transition: all .3s;
    }
    .how-step:hover { border-color: rgba(59,130,246,.2); transform: translateY(-2px); }
    .how-num {
      width: 44px; height: 44px; margin: 0 auto 16px;
      background: linear-gradient(135deg, var(--primary), #6366f1);
      color: #fff; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; font-weight: 700;
      box-shadow: 0 4px 12px rgba(59,130,246,.2);
    }
    .how-icon { margin-bottom: 16px; }
    .how-step h3 { font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 10px; }
    .how-step p { font-size: .87rem; color: var(--text-muted); line-height: 1.6; }

    .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
    .why-card {
      text-align: center; padding: 36px 24px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; transition: all .3s;
    }
    .why-card:hover { border-color: rgba(59,130,246,.2); transform: translateY(-2px); }
    .why-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; transition: transform .3s; }
    .why-card:hover .why-icon { transform: scale(1.1); }
    .why-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .why-card p { font-size: .85rem; color: var(--text-muted); line-height: 1.6; }

    .crud-section .section-header { margin-bottom: 32px; }

    .tabs {
      display: flex; gap: 0; margin-bottom: 28px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 4px; overflow: hidden;
    }
    .tab {
      flex: 1; padding: 12px 24px;
      background: transparent; color: var(--text-muted);
      border: none; cursor: pointer; font-size: .9rem; font-weight: 600;
      border-radius: 8px; transition: all .25s;
    }
    .tab:hover { color: var(--text); background: var(--surface-hover); }
    .tab.active { color: #fff; background: var(--primary); }

    .crud-content { display: flex; flex-direction: column; gap: 24px; }
    .crud-bar { display: flex; gap: 8px; }
    .form-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 24px;
      border-left: 3px solid var(--primary);
    }
    .form-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: var(--text); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-bottom: 16px; }
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
    .loading { margin-top: 8px; font-size: .85rem; color: var(--text-muted); font-style: italic; }

    .table-wrapper {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 14px 18px; text-align: left; font-size: .88rem; }
    th {
      background: var(--surface-hover); font-weight: 600;
      color: var(--text-muted); text-transform: uppercase;
      font-size: .72rem; letter-spacing: .6px;
      border-bottom: 1px solid var(--border);
    }
    td { color: var(--text); border-bottom: 1px solid var(--border); }
    tbody tr { transition: background .15s; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover td { background: rgba(59,130,246,.03); }
    .actions { display: flex; gap: 8px; }
    .empty { padding: 48px; text-align: center; color: var(--text-muted); }
    .err { color: var(--danger); font-size: .9rem; padding: 10px 0; display: flex; align-items: center; gap: 6px; }
    .err::before { content: '⚠'; }
    .success {
      color: var(--success); font-size: .9rem; padding: 10px 16px; font-weight: 500;
      background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.15);
      border-radius: 8px; display: flex; align-items: center; gap: 6px;
    }
    .success::before { content: '✓'; font-weight: 700; }

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

    .footer {
      padding: 60px 24px 36px;
      background: linear-gradient(180deg, var(--surface) 0%, #0d0d14 100%);
      border-top: 1px solid var(--border);
    }
    .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 40px; margin-bottom: 36px; }
    .footer-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 16px; }
    .footer-logo .accent { color: var(--primary); }
    .footer-desc { font-size: .87rem; color: var(--text-muted); line-height: 1.6; max-width: 280px; }
    .footer-social { display: flex; gap: 10px; margin-top: 20px; }
    .footer-social a { width: 40px; height: 40px; border-radius: 10px; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all .2s; cursor: pointer; }
    .footer-social a:hover { background: var(--primary); color: #fff; transform: translateY(-2px); }
    .footer h4 { font-size: .82rem; font-weight: 700; color: var(--text); margin-bottom: 16px; text-transform: uppercase; letter-spacing: .08em; }
    .footer a, .footer span { display: block; font-size: .87rem; color: var(--text-muted); padding: 4px 0; text-decoration: none; cursor: pointer; transition: color .2s; }
    .footer a:hover { color: var(--primary); }
    .footer-contact { font-weight: 600; color: var(--text); }
    .footer-hours-title { font-weight: 600; color: var(--text); margin-top: 16px; display: block; }
    .footer-bottom { border-top: 1px solid var(--border); padding-top: 24px; text-align: center; font-size: .82rem; color: var(--text-muted); }
  `]
})
export class HomeComponent implements OnInit {
  activeTab = 'funcionarios';

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
    this.ordensService.listar().subscribe(ordens => {
      this.stats.totalOS = ordens.length;
      this.stats.receita = ordens
        .filter(o => o.status === 'Entregue' && o.valorTotal)
        .reduce((acc, o) => acc + (o.valorTotal ?? 0), 0);
    });
    this.clientesService.listar().subscribe(c => {
      this.stats.clientesAtivos = c.filter(c => c.ativo).length;
    });
    this.equipamentosService.listar().subscribe(e => {
      this.stats.equipamentos = e.length;
    });
  }

  scrollPara(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
