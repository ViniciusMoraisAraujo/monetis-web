import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateExpenseRequest,
  CreateInstallmentExpenseRequest,
  ExpenseResponse,
  UpdateExpenseRequest,
} from '../../models/expense.model';
import { PAYMENT_METHOD_LABELS, PaymentMethod } from '../../../../shared/models/enums';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { CardsStateService } from '../../../cards/services/cards-state.service';

export interface ExpenseDialogData {
  expense?: ExpenseResponse;
}

export type ExpenseDialogResult =
  | { type: 'single'; data: CreateExpenseRequest }
  | { type: 'installment'; data: CreateInstallmentExpenseRequest }
  | { type: 'update'; data: UpdateExpenseRequest };

@Component({
  selector: 'app-expense-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './expense-form-dialog.component.html',
  styleUrl: './expense-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<ExpenseFormDialogComponent, ExpenseDialogResult>,
  );
  private readonly destroyRef = inject(DestroyRef);
  readonly data = inject<ExpenseDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly categoriesState = inject(CategoriesStateService);
  readonly accountsState = inject(AccountsStateService);
  readonly cardsState = inject(CardsStateService);

  readonly isEdit = !!this.data?.expense;
  readonly isInstallment = new FormControl<boolean>(false, { nonNullable: true });

  readonly paymentMethodOptions = [
    { value: PaymentMethod.Cash, label: PAYMENT_METHOD_LABELS[PaymentMethod.Cash] },
    { value: PaymentMethod.Debit, label: PAYMENT_METHOD_LABELS[PaymentMethod.Debit] },
    { value: PaymentMethod.CreditCard, label: PAYMENT_METHOD_LABELS[PaymentMethod.CreditCard] },
    { value: PaymentMethod.Pix, label: PAYMENT_METHOD_LABELS[PaymentMethod.Pix] },
    { value: PaymentMethod.Transfer, label: PAYMENT_METHOD_LABELS[PaymentMethod.Transfer] },
  ];

  get isCreditCardSelected(): boolean {
    return this.form.controls.paymentMethod.value === PaymentMethod.CreditCard;
  }

  readonly form = new FormGroup({
    description: new FormControl<string>(this.data?.expense?.description ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    amount: new FormControl<number | null>(this.data?.expense?.amount ?? null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    date: new FormControl<string>(
      this.data?.expense?.date
        ? this.data.expense.date.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    categoryId: new FormControl<string>(this.data?.expense?.categoryId ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    paymentMethod: new FormControl<PaymentMethod>(
      this.data?.expense?.paymentMethod ?? PaymentMethod.CreditCard,
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    accountId: new FormControl<string | null>(this.data?.expense?.accountId ?? null),
    creditCardId: new FormControl<string | null>(this.data?.expense?.creditCardId ?? null),
    totalInstallments: new FormControl<number>(2, {
      nonNullable: true,
      validators: [Validators.min(2), Validators.max(24)],
    }),
  });

  ngOnInit(): void {
    this.categoriesState.loadCategories();
    this.accountsState.loadAccounts();
    this.cardsState.loadCards();

    this.form.controls.paymentMethod.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((method) => {
        this.updateCreditCardValidation(method);
      });

    this.updateCreditCardValidation(this.form.controls.paymentMethod.value);
  }

  onPaymentMethodChange(): void {
    this.updateCreditCardValidation(this.form.controls.paymentMethod.value);
  }

  private updateCreditCardValidation(method: PaymentMethod): void {
    const isCreditCard = method === PaymentMethod.CreditCard;
    if (isCreditCard) {
      this.form.controls.creditCardId.setValidators([Validators.required]);
    } else {
      this.form.controls.creditCardId.clearValidators();
    }
    this.form.controls.creditCardId.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const isoDate = new Date(`${raw.date}T12:00:00Z`).toISOString();

    if (this.isEdit) {
      const updateData: UpdateExpenseRequest = {
        description: raw.description.trim(),
        amount: Number(raw.amount),
        date: isoDate,
        categoryId: raw.categoryId,
      };
      this.dialogRef.close({ type: 'update', data: updateData });
      return;
    }

    if (this.isInstallment.value) {
      const installmentData: CreateInstallmentExpenseRequest = {
        description: raw.description.trim(),
        totalAmount: Number(raw.amount),
        totalInstallments: Number(raw.totalInstallments),
        firstDueDate: isoDate,
        paymentMethod: raw.paymentMethod,
        categoryId: raw.categoryId,
        accountId: raw.accountId || null,
        creditCardId: raw.creditCardId || null,
      };
      this.dialogRef.close({ type: 'installment', data: installmentData });
      return;
    }

    const singleData: CreateExpenseRequest = {
      description: raw.description.trim(),
      amount: Number(raw.amount),
      date: isoDate,
      paymentMethod: raw.paymentMethod,
      categoryId: raw.categoryId,
      accountId: raw.accountId || null,
      creditCardId: raw.creditCardId || null,
    };
    this.dialogRef.close({ type: 'single', data: singleData });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
