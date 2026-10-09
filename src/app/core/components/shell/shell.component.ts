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
import { PrivacyService } from '../../services/privacy.service';
import { ErrorToastComponent } from '../error-toast/error-toast.component';

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
    MatListModule,
    ErrorToastComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  readonly privacyService = inject(PrivacyService);
  private readonly router = inject(Router);

  private readonly isDesktopQuery = toSignal(
    this.breakpointObserver.observe('(min-width: 768px)').pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly isDesktop = computed(() => !!this.isDesktopQuery());
  readonly isDarkMode = this.themeService.isDarkMode;
  readonly currentUser = this.authService.currentUser;

  readonly userName = computed(() => {
    const email = this.currentUser()?.email;
    if (!email) return 'Usuário';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

  readonly userInitial = computed(() => {
    return this.userName().charAt(0).toUpperCase();
  });

  readonly userProfileRoute = computed(() => {
    const id = this.currentUser()?.id;
    return id ? `/Users/${id}` : '/Users';
  });

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Início', icon: 'dashboard' },
    { path: '/accounts', label: 'Contas', icon: 'account_balance' },
    { path: '/cards', label: 'Cartões', icon: 'credit_card' },
    { path: '/expenses', label: 'Despesas', icon: 'trending_down' },
    { path: '/incomes', label: 'Receitas', icon: 'trending_up' },
    { path: '/transfers', label: 'Transferências', icon: 'swap_horiz' },
    { path: '/subscriptions', label: 'Assinaturas', icon: 'auto_mode' },
    { path: '/categories', label: 'Categorias', icon: 'category' },
  ];

  // Mobile bottom bar exibe os 4 itens principais para não poluir
  readonly mobileNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Início', icon: 'dashboard' },
    { path: '/accounts', label: 'Contas', icon: 'account_balance' },
    { path: '/cards', label: 'Cartões', icon: 'credit_card' },
    { path: '/expenses', label: 'Despesas', icon: 'trending_down' },
    { path: '/incomes', label: 'Receitas', icon: 'trending_up' },
  ];

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onTogglePrivacy(): void {
    this.privacyService.toggleValuesVisibility();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
