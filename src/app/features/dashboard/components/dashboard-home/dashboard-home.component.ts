import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Visão Geral</h1>
        <p>Bem-vindo ao Monetis! Seu controle financeiro pessoal simplificado.</p>
      </header>

      <section class="welcome-card" aria-label="Introdução ao painel">
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar aria-hidden="true" class="welcome-icon">savings</mat-icon>
            <mat-card-title>Primeiros Passos</mat-card-title>
            <mat-card-subtitle>Configure suas contas e cartões para começar</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Utilize o menu para cadastrar suas contas bancárias, cartões de crédito e começar a registrar despesas e receitas.</p>
          </mat-card-content>
        </mat-card>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 700;
      color: var(--mat-sys-on-surface);
    }

    .dashboard-header p {
      margin-top: 0.25rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .welcome-card mat-card {
      border-radius: 1rem;
      background-color: var(--mat-sys-surface-container);
    }

    .welcome-icon {
      color: var(--mat-sys-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHomeComponent {}
