import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe } from '@angular/common';
import '../../../../core/i18n';
import { ExpenseResponse, PayExpenseRequest } from '../../models/expense.model';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';

export interface ExpensePayDialogData {
  expense: ExpenseResponse;
}

@Component({
  selector: 'app-expense-pay-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './expense-pay-dialog.component.html',
  styleUrl: './expense-pay-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensePayDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ExpensePayDialogComponent, PayExpenseRequest>);
  readonly data = inject<ExpensePayDialogData>(MAT_DIALOG_DATA);
  readonly accountsState = inject(AccountsStateService);

  readonly expense = this.data.expense;

  readonly form = new FormGroup({
    paidAt: new FormControl<string>(new Date().toISOString().substring(0, 10), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    accountId: new FormControl<string>(this.expense.accountId ?? '', {
      nonNullable: true,
      validators: this.expense.accountId ? [] : [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.accountsState.loadAccounts();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: PayExpenseRequest = {
      paidAt: new Date(`${raw.paidAt}T12:00:00Z`).toISOString(),
      accountId: raw.accountId || undefined,
    };

    this.dialogRef.close(payload);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
