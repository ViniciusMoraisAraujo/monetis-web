import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import '../../../../core/i18n';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { ExpensesStateService } from '../../../expenses/services/expenses-state.service';
import { IncomesStateService } from '../../../incomes/services/incomes-state.service';
import { CardsStateService } from '../../../cards/services/cards-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PrivacyService } from '../../../../core/services/privacy.service';
import { ErrorToastService } from '../../../../core/services/error-toast.service';

export interface RecentTransactionItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  categoryName?: string;
  isPaid?: boolean;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent implements OnInit {
  readonly accountsState = inject(AccountsStateService);
  readonly expensesState = inject(ExpensesStateService);
  readonly incomesState = inject(IncomesStateService);
  readonly cardsState = inject(CardsStateService);
  private readonly authService = inject(AuthService);
  readonly privacy = inject(PrivacyService);
  private readonly errorToast = inject(ErrorToastService);

  readonly isBalanceVisible = this.privacy.isValuesVisible;

  readonly loading = computed(() => {
    return (
      this.accountsState.isLoading() ||
      this.expensesState.loading() ||
      this.incomesState.loading() ||
      this.cardsState.loading()
    );
  });

  readonly errorMessage = computed(() => {
    return (
      this.accountsState.errorMessage() ||
      this.expensesState.error() ||
      this.incomesState.error() ||
      this.cardsState.error()
    );
  });

  private readonly logSyncErrorEffect = effect(() => {
    const err = this.errorMessage();
    if (err) {
      console.error('Technical sync error details:', err);
      this.errorToast.show({
        retryAction: () => this.loadAll(),
      });
    }
  });

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    let salutation = 'Olá';
    if (hour >= 5 && hour < 12) salutation = 'Bom dia';
    else if (hour >= 12 && hour < 18) salutation = 'Boa tarde';
    else salutation = 'Boa noite';

    const email = this.authService.currentUser()?.email;
    if (!email) return `${salutation}, Vinicius`;
    const rawName = email.split('@')[0];
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    return `${salutation}, ${name}`;
  });

  readonly netBalance = computed(() => {
    return this.incomesState.totalAmount() - this.expensesState.totalAmount();
  });

  readonly absNetBalance = computed(() => {
    return Math.abs(this.netBalance());
  });

  readonly recentTransactions = computed<RecentTransactionItem[]>(() => {
    const expenses: RecentTransactionItem[] = this.expensesState.expenses().map((e) => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.date,
      type: 'expense',
      categoryName: e.categoryName,
      isPaid: e.isPaid,
    }));

    const incomes: RecentTransactionItem[] = this.incomesState.incomes().map((i) => ({
      id: i.id,
      description: i.description,
      amount: i.amount,
      date: i.receivedAt || i.date || '',
      type: 'income',
      categoryName: i.categoryName,
      isPaid: i.isReceived,
    }));

    return [...expenses, ...incomes]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  readonly creditCardExpenses = computed(() => {
    return this.expensesState.expenses().filter((e) => !!e.creditCardId);
  });

  readonly creditCardTotal = computed(() => {
    return this.creditCardExpenses().reduce((sum, e) => sum + e.amount, 0);
  });

  readonly creditLimit = computed(() => {
    const total = this.creditCardTotal();
    return total > 0 ? Math.max(5000, total * 1.5) : 5000;
  });

  readonly availableLimit = computed(() => {
    return Math.max(0, this.creditLimit() - this.creditCardTotal());
  });

  readonly creditLimitUsedPercent = computed(() => {
    const limit = this.creditLimit();
    if (limit <= 0) return 0;
    return Math.min(100, Math.round((this.creditCardTotal() / limit) * 100));
  });

  readonly flowIncomePercent = computed(() => {
    const inc = this.incomesState.totalAmount();
    const exp = this.expensesState.totalAmount();
    const total = inc + exp;
    if (total <= 0) return 50;
    return Math.min(100, Math.max(5, Math.round((inc / total) * 100)));
  });

  readonly flowExpensePercent = computed(() => {
    return 100 - this.flowIncomePercent();
  });

  toggleBalanceVisibility(): void {
    this.privacy.toggleValuesVisibility();
  }

  loadAll(): void {
    this.accountsState.loadAccounts();
    this.expensesState.loadExpenses();
    this.incomesState.loadIncomes();
    this.cardsState.loadCards();
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
