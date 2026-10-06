import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';

export interface HomeFeature {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface HomeStep {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDarkMode;

  readonly features: HomeFeature[] = [
    {
      icon: 'account_balance',
      title: 'Contas',
      description: 'Cadastre bancos, carteiras e dinheiro em espécie com saldo consolidado.',
    },
    {
      icon: 'credit_card',
      title: 'Cartões',
      description: 'Faturas, limite disponível e compras parceladas organizados por cartão.',
    },
    {
      icon: 'trending_down',
      title: 'Despesas',
      description: 'Registre saídas com categoria, vencimento e status de pagamento.',
    },
    {
      icon: 'trending_up',
      title: 'Receitas',
      description: 'Controle entradas e recebimentos com confirmação de pagamento.',
    },
    {
      icon: 'auto_mode',
      title: 'Assinaturas',
      description: 'Gastos recorrentes com alerta de vencimento e renovação.',
    },
    {
      icon: 'swap_horiz',
      title: 'Transferências',
      description: 'Movimente valores entre suas contas mantendo o histórico completo.',
    },
  ];

  readonly steps: HomeStep[] = [
    {
      title: 'Criar sua conta',
      description: 'Cadastro gratuito e rápido, sem burocracia e sem cartão de crédito.',
    },
    {
      title: 'Cadastrar suas contas',
      description: 'Adicione bancos, cartões e categorias do seu jeito, no seu ritmo.',
    },
    {
      title: 'Acompanhar o painel',
      description: 'Veja entradas, saídas e próximos vencimentos no dashboard.',
    },
  ];

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
