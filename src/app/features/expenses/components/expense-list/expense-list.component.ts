import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import '../../../../core/i18n';
import { ExpensesStateService } from '../../services/expenses-state.service';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import {
  ExpenseFilterParams,
  ExpenseResponse,
  PayExpenseRequest,
} from '../../models/expense.model';
import { PAYMENT_METHOD_LABELS } from '../../../../shared/models/enums';
import { ExpenseFormDialogComponent, ExpenseDialogResult } from '../expense-form-dialog/expense-form-dialog.component';
import { ExpensePayDialogComponent } from '../expense-pay-dialog/expense-pay-dialog.component';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseListComponent implements OnInit {
  readonly state = inject(ExpensesStateService);
  readonly categoriesState = inject(CategoriesStateService);
  private readonly dialog = inject(MatDialog);

  readonly paymentMethodLabels = PAYMENT_METHOD_LABELS;

  readonly filterStatus = new FormControl<'all' | 'paid' | 'unpaid'>('all', { nonNullable: true });
  readonly filterCategory = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.state.loadExpenses();
    this.categoriesState.loadCategories();
  }

  applyFilters(): void {
    const status = this.filterStatus.value;
    const categoryId = this.filterCategory.value || undefined;

    let isPaid: boolean | undefined = undefined;
    if (status === 'paid') isPaid = true;
    if (status === 'unpaid') isPaid = false;

    const filters: ExpenseFilterParams = {
      isPaid,
      categoryId,
    };

    this.state.loadExpenses(filters);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ExpenseFormDialogComponent, {
      width: '100%',
      maxWidth: '520px',
    });

    dialogRef.afterClosed().subscribe((result: ExpenseDialogResult | undefined) => {
      if (!result) return;

      if (result.type === 'single') {
        this.state.createExpense(result.data).subscribe();
      } else if (result.type === 'installment') {
        this.state.createInstallments(result.data).subscribe();
      }
    });
  }

  openEditDialog(expense: ExpenseResponse): void {
    const dialogRef = this.dialog.open(ExpenseFormDialogComponent, {
      width: '100%',
      maxWidth: '520px',
      data: { expense },
    });

    dialogRef.afterClosed().subscribe((result: ExpenseDialogResult | undefined) => {
      if (result && result.type === 'update') {
        this.state.updateExpense(expense.id, result.data).subscribe();
      }
    });
  }

  openPayDialog(expense: ExpenseResponse): void {
    const dialogRef = this.dialog.open(ExpensePayDialogComponent, {
      width: '100%',
      maxWidth: '440px',
      data: { expense },
    });

    dialogRef.afterClosed().subscribe((result: PayExpenseRequest | undefined) => {
      if (result) {
        this.state.payExpense(expense.id, result).subscribe();
      }
    });
  }

  onDelete(expense: ExpenseResponse): void {
    if (confirm(`Deseja realmente excluir a despesa "${expense.description}"?`)) {
      this.state.deleteExpense(expense.id).subscribe();
    }
  }
}
