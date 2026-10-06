import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  private readonly isDesktopQuery = toSignal(
    this.breakpointObserver.observe('(min-width: 768px)').pipe(map((state) => state.matches)),
    { initialValue: false }
  );

  readonly isDesktop = computed(() => !!this.isDesktopQuery());
  readonly isDarkMode = this.themeService.isDarkMode;
  readonly currentUser = this.authService.currentUser;

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Início', icon: 'dashboard' },
    { path: '/accounts', label: 'Contas', icon: 'account_balance' },
    { path: '/cards', label: 'Cartões', icon: 'credit_card' },
    { path: '/expenses', label: 'Despesas', icon: 'trending_down' },
    { path: '/incomes', label: 'Receitas', icon: 'trending_up' },
    { path: '/transfers', label: 'Transferências', icon: 'swap_horiz' },
    { path: '/categories', label: 'Categorias', icon: 'category' }
  ];

  // Mobile bottom bar exibe os 4 itens principais para não poluir
  readonly mobileNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Início', icon: 'dashboard' },
    { path: '/accounts', label: 'Contas', icon: 'account_balance' },
    { path: '/expenses', label: 'Despesas', icon: 'trending_down' },
    { path: '/incomes', label: 'Receitas', icon: 'trending_up' }
  ];

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
