import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import '../../../../core/i18n';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { ExpensesStateService } from '../../../expenses/services/expenses-state.service';
import { IncomesStateService } from '../../../incomes/services/incomes-state.service';

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
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent implements OnInit {
  readonly accountsState = inject(AccountsStateService);
  readonly expensesState = inject(ExpensesStateService);
  readonly incomesState = inject(IncomesStateService);

  readonly netBalance = computed(() => {
    return this.incomesState.totalAmount() - this.expensesState.totalAmount();
  });

  readonly recentExpenses = computed(() => {
    return this.expensesState.expenses().slice(0, 5);
  });

  ngOnInit(): void {
    this.accountsState.loadAccounts();
    this.expensesState.loadExpenses();
    this.incomesState.loadIncomes();
  }
}
