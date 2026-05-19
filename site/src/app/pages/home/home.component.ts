import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="landing">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-badge">Sistema de Gerenciamento</div>
          <h1>Assistência Técnica</h1>
          <p class="hero-sub">Sistema completo para gerenciar sua oficina com facilidade</p>
          <p class="hero-desc">Cadastre, consulte, altere e gerencie funcionários e clientes em um só lugar.</p>
          <div class="hero-actions">
            <a class="btn-primary-lg" routerLink="/funcionarios">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Gerenciar Funcionários
            </a>
            <a class="btn-secondary-lg" routerLink="/clientes">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Gerenciar Clientes
            </a>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="stats">
        <div class="section-inner">
          <div class="stats-grid">
            <div class="stat-item"><span class="stat-num">100%</span><span class="stat-label">Online</span></div>
            <div class="stat-item"><span class="stat-num">Grátis</span><span class="stat-label">Sem custos</span></div>
            <div class="stat-item"><span class="stat-num">Simples</span><span class="stat-label">De usar</span></div>
            <div class="stat-item"><span class="stat-num">Seguro</span><span class="stat-label">Local</span></div>
          </div>
        </div>
      </section>

      <!-- Services -->
      <section class="section">
        <div class="section-inner">
          <div class="section-header">
            <h2>Funcionalidades</h2>
            <p>Tudo que você precisa para gerenciar sua assistência técnica</p>
          </div>
          <div class="grid-3">
            <div class="service-card">
              <div class="service-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Cadastro de Funcionários</h3>
              <p>Gerencie técnicos, atendentes e sua equipe com informações completas como nome, cargo, telefone e email.</p>
            </div>
            <div class="service-card">
              <div class="service-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h3>Cadastro de Clientes</h3>
              <p>Mantenha registros detalhados com nome, email, telefone e endereço completo dos seus clientes.</p>
            </div>
            <div class="service-card">
              <div class="service-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3>Consulta Rápida</h3>
              <p>Busca instantânea por ID. Localize qualquer funcionário ou cliente em segundos, sem complicação.</p>
            </div>
            <div class="service-card">
              <div class="service-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3>Alteração de Dados</h3>
              <p>Edite informações de funcionários e clientes de forma simples e intuitiva, com formulários claros.</p>
            </div>
            <div class="service-card">
              <div class="service-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <h3>Exclusão Segura</h3>
              <p>Remova registros indesejados com segurança. Mantenha sua base de dados sempre organizada.</p>
            </div>
            <div class="service-card">
              <div class="service-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <h3>Listagem Organizada</h3>
              <p>Tabelas limpas com visualização completa de todos os registros, organizadas para fácil consulta.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <div class="section-inner">
          <div class="section-header">
            <h2>Por que usar nosso sistema?</h2>
          </div>
          <div class="features-row">
            <div class="feature-block">
              <div class="feature-icon-box">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h3>Simplicidade</h3>
                <p>Interface direta e intuitiva. Sem complicações, foco no que importa: gerenciar sua assistência técnica.</p>
              </div>
            </div>
            <div class="feature-block">
              <div class="feature-icon-box">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <h3>Segurança</h3>
                <p>Dados armazenados localmente em JSON. Você tem controle total sobre suas informações.</p>
              </div>
            </div>
            <div class="feature-block">
              <div class="feature-icon-box">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div>
                <h3>Rapidez</h3>
                <p>Consultas instantâneas. Interface responsiva que não te faz esperar.</p>
              </div>
            </div>
            <div class="feature-block">
              <div class="feature-icon-box">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 22c4.5-3.2 8-7.8 8-12.5A8 8 0 0 0 12 1a8 8 0 0 0-8 8.5c0 4.7 3.5 9.3 8 12.5z"/><circle cx="12" cy="9" r="2"/></svg>
              </div>
              <div>
                <h3>Leve</h3>
                <p>Sem banco de dados complexo. Apenas Angular e JSON. Roda em qualquer máquina.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CRUD Flow -->
      <section class="section flow">
        <div class="section-inner">
          <div class="section-header">
            <h2>CRUD Completo</h2>
            <p>Cadastre, consulte, altere e exclua — tudo de forma simples e intuitiva</p>
          </div>
          <div class="flow-steps">
            <div class="flow-step">
              <div class="flow-num">1</div>
              <div class="flow-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </div>
              <h3>Cadastrar</h3>
              <p>Adicione funcionários com nome, cargo, telefone e email. Cadastre clientes com endereço completo e contato.</p>
            </div>
            <div class="flow-arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
            <div class="flow-step">
              <div class="flow-num">2</div>
              <div class="flow-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3>Consultar</h3>
              <p>Busque qualquer registro pelo ID em segundos. Ideal para localizar informações rapidamente no dia a dia.</p>
            </div>
            <div class="flow-arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
            <div class="flow-step">
              <div class="flow-num">3</div>
              <div class="flow-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3>Alterar</h3>
              <p>Edite dados existentes de forma intuitiva. Atualize informações sempre que necessário com poucos cliques.</p>
            </div>
            <div class="flow-arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
            <div class="flow-step">
              <div class="flow-num">4</div>
              <div class="flow-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <h3>Excluir</h3>
              <p>Remova registros com segurança. Mantenha sua base de dados limpa e organizada sem esforço.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Target -->
      <section class="section target">
        <div class="section-inner">
          <div class="section-header">
            <h2>Para quem é este sistema?</h2>
          </div>
          <div class="target-grid">
            <div class="target-card">
              <div class="target-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Técnicos Autônomos</h3>
              <p>Organize seus clientes e tenha o controle dos serviços realizados. Tudo simples e sem burocracia.</p>
            </div>
            <div class="target-card">
              <div class="target-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3>Assistências Técnicas</h3>
              <p>Gerencie sua equipe de técnicos e a base de clientes. Tenha tudo centralizado em um só sistema.</p>
            </div>
            <div class="target-card">
              <div class="target-icon" style="background: rgba(59,130,246,.12);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <h3>Pequenas Empresas</h3>
              <p>Ideal para negócios que precisam de um controle simples de funcionários e clientes sem custo.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section testimonials">
        <div class="section-inner">
          <div class="section-header">
            <h2>O que dizem nossos usuários</h2>
          </div>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="stars">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p>"Sistema muito prático. Consegui organizar toda minha equipe e clientes em poucos minutos. Recomendo!"</p>
              <span class="testimonial-author">Carlos André</span>
              <span class="testimonial-role">Técnico Autorizado</span>
            </div>
            <div class="testimonial-card">
              <div class="stars">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p>"Exatamente o que eu precisava para organizar minha assistência. Simples, funcional e bonito."</p>
              <span class="testimonial-author">Maria Oliveira</span>
              <span class="testimonial-role">Proprietária de Oficina</span>
            </div>
            <div class="testimonial-card">
              <div class="stars">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p>"Interface limpa e objetiva. Meus funcionários aprenderam a usar em 5 minutos. Nota 10!"</p>
              <span class="testimonial-author">Pedro Santos</span>
              <span class="testimonial-role">Gestor de TI</span>
            </div>
          </div>
        </div>
      </section>

      <!-- About -->
      <section class="section about">
        <div class="section-inner">
          <div class="section-header">
            <h2>Sobre o Sistema</h2>
            <p>Construído com tecnologia moderna para máxima performance</p>
          </div>
          <div class="about-grid">
            <div class="about-card">
              <div class="about-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
              </div>
              <h3>Angular 21</h3>
              <p>Desenvolvido com a versão mais recente do framework, garantindo performance, segurança e componentes modernos.</p>
            </div>
            <div class="about-card">
              <div class="about-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <h3>json-server</h3>
              <p>API simulada com json-server. Dados armazenados em JSON, fáceis de fazer backup e transportar.</p>
            </div>
            <div class="about-card">
              <div class="about-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg>
              </div>
              <h3>TypeScript</h3>
              <p>Código totalmente tipado para maior confiabilidade, menos bugs e melhor experiência de desenvolvimento.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta">
        <div class="section-inner">
          <div class="cta-card">
            <h2>Pronto para começar?</h2>
            <p>Acesse agora o gerenciamento de funcionários ou clientes.</p>
            <div class="cta-actions">
              <a class="btn-cta" routerLink="/funcionarios">Funcionários</a>
              <a class="btn-cta" routerLink="/clientes">Clientes</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="section-inner">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                <span>Assistência <span class="accent">Técnica</span></span>
              </div>
              <p class="footer-desc">Sistema de gerenciamento para assistências técnicas. Cadastro, consulta e gestão de funcionários e clientes.</p>
              <div class="footer-social">
                <a href="#" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4>Navegação</h4>
              <a routerLink="/funcionarios">Funcionários</a>
              <a routerLink="/funcionarios/cadastrar">Cadastrar Funcionário</a>
              <a routerLink="/funcionarios/consultar">Consultar Funcionário</a>
              <a routerLink="/clientes">Clientes</a>
              <a routerLink="/clientes/cadastrar">Cadastrar Cliente</a>
              <a routerLink="/clientes/consultar">Consultar Cliente</a>
            </div>
            <div>
              <h4>Tecnologia</h4>
              <span>Angular 21</span>
              <span>json-server 0.17.4</span>
              <span>TypeScript 5.9</span>
              <span>HTML5 & CSS3</span>
              <span>RxJS</span>
            </div>
            <div>
              <h4>Horário</h4>
              <span>Segunda a Sexta</span>
              <span class="footer-hours">09:00 — 18:00</span>
              <span>Sábado</span>
              <span class="footer-hours">09:00 — 13:00</span>
              <span class="footer-note">Sistema disponível 24/7</span>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 Assistência Técnica. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    .landing { width: 100%; }

    .hero {
      position: relative; overflow: hidden;
      padding: 100px 24px 80px; text-align: center;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-content { position: relative; max-width: 720px; margin: 0 auto; }
    .hero-badge {
      display: inline-block; padding: 6px 16px; margin-bottom: 20px;
      background: rgba(59,130,246,.1); color: var(--primary);
      font-size: .8rem; font-weight: 600; border-radius: 20px;
      letter-spacing: .03em;
    }
    h1 { font-size: 2.5rem; font-weight: 800; color: var(--text); margin-bottom: 12px; letter-spacing: -.02em; }
    .hero-sub { font-size: 1.15rem; color: var(--text-muted); margin-bottom: 8px; }
    .hero-desc { font-size: .95rem; color: var(--text-muted); opacity: .8; margin-bottom: 36px; }
    .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .btn-primary-lg, .btn-secondary-lg {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; font-size: .95rem; font-weight: 600;
      border-radius: 10px; text-decoration: none; transition: all .15s;
    }
    .btn-primary-lg { background: var(--primary); color: #fff; }
    .btn-primary-lg:hover { background: var(--primary-hover); color: #fff; transform: translateY(-1px); }
    .btn-secondary-lg { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
    .btn-secondary-lg:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); }

    /* Stats */
    .stats { padding: 32px 24px; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center; }
    .stat-item { display: flex; flex-direction: column; gap: 4px; }
    .stat-num { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
    .stat-label { font-size: .82rem; color: var(--text-muted); }
    @media (max-width: 500px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

    /* Sections */
    .section { padding: 80px 24px; }
    .section:nth-child(even) { background: var(--surface); }
    .section-inner { max-width: 1120px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 48px; }
    .section-header h2 { font-size: 1.75rem; font-weight: 800; color: var(--text); margin-bottom: 10px; }
    .section-header p { color: var(--text-muted); font-size: 1rem; }

    /* Grids */
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }

    /* Service Cards */
    .service-card { padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; transition: all .15s; }
    .service-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.3); }
    .service-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .service-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .service-card p { font-size: .85rem; color: var(--text-muted); line-height: 1.5; }

    /* Features */
    .features { padding: 80px 24px; }
    .features-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px; }
    .feature-block { display: flex; gap: 20px; align-items: flex-start; padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
    .feature-icon-box { width: 56px; height: 56px; border-radius: 14px; background: rgba(59,130,246,.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .feature-block h3 { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .feature-block p { font-size: .85rem; color: var(--text-muted); line-height: 1.5; }
    @media (max-width: 500px) { .features-row { grid-template-columns: 1fr; } }

    /* Flow */
    .flow { background: var(--bg); }
    .flow-steps { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; }
    .flow-step { text-align: center; padding: 28px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; flex: 1; min-width: 160px; max-width: 220px; }
    .flow-num { width: 32px; height: 32px; margin: 0 auto 12px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .85rem; font-weight: 700; }
    .flow-icon { margin-bottom: 12px; }
    .flow-step h3 { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .flow-step p { font-size: .82rem; color: var(--text-muted); line-height: 1.5; }
    .flow-arrow { flex-shrink: 0; display: flex; align-items: center; padding: 0 4px; }
    @media (max-width: 768px) { .flow-steps { gap: 16px; } .flow-arrow { display: none; } }

    /* Target */
    .target-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .target-card { text-align: center; padding: 32px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
    .target-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .target-card h3 { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .target-card p { font-size: .85rem; color: var(--text-muted); line-height: 1.5; }

    /* Testimonials */
    .testimonials { background: var(--surface); }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .testimonial-card { padding: 28px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; }
    .stars { display: flex; gap: 2px; margin-bottom: 16px; }
    .testimonial-card p { font-size: .9rem; color: var(--text); line-height: 1.6; font-style: italic; margin-bottom: 16px; }
    .testimonial-author { display: block; font-size: .85rem; font-weight: 700; color: var(--text); }
    .testimonial-role { display: block; font-size: .78rem; color: var(--text-muted); margin-top: 2px; }

    /* About */
    .about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
    .about-card { text-align: center; padding: 36px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
    .about-icon { width: 60px; height: 60px; margin: 0 auto 16px; background: rgba(59,130,246,.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .about-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .about-card p { font-size: .85rem; color: var(--text-muted); line-height: 1.5; }

    /* CTA */
    .cta { padding: 40px 24px 80px; }
    .cta-card { text-align: center; padding: 56px 32px; background: linear-gradient(135deg, rgba(59,130,246,.08), rgba(59,130,246,.02)); border: 1px solid rgba(59,130,246,.15); border-radius: 16px; }
    .cta-card h2 { font-size: 1.5rem; font-weight: 800; color: var(--text); margin-bottom: 10px; }
    .cta-card p { color: var(--text-muted); font-size: .95rem; margin-bottom: 28px; }
    .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn-cta { padding: 11px 24px; background: var(--primary); color: #fff; font-size: .9rem; font-weight: 600; border-radius: 8px; text-decoration: none; transition: background .15s; }
    .btn-cta:hover { background: var(--primary-hover); color: #fff; }

    /* Footer */
    .footer { padding: 48px 24px 32px; background: var(--surface); border-top: 1px solid var(--border); }
    .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 32px; margin-bottom: 32px; }
    .footer-logo { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 12px; }
    .footer-logo .accent { color: var(--primary); }
    .footer-desc { font-size: .85rem; color: var(--text-muted); line-height: 1.5; max-width: 260px; }
    .footer-social { display: flex; gap: 8px; margin-top: 16px; }
    .footer-social a { width: 36px; height: 36px; border-radius: 8px; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all .15s; }
    .footer-social a:hover { background: var(--primary); color: #fff; }
    .footer h4 { font-size: .82rem; font-weight: 700; color: var(--text); margin-bottom: 14px; text-transform: uppercase; letter-spacing: .05em; }
    .footer a, .footer span { display: block; font-size: .85rem; color: var(--text-muted); padding: 3px 0; text-decoration: none; }
    .footer a:hover { color: var(--primary); }
    .footer-hours { font-weight: 600; color: var(--text); margin-bottom: 10px; }
    .footer-note { font-size: .78rem; color: var(--text-muted); margin-top: 8px; font-style: italic; }
    .footer-bottom { border-top: 1px solid var(--border); padding-top: 20px; text-align: center; font-size: .82rem; color: var(--text-muted); }
  `]
})
export class HomeComponent {}
