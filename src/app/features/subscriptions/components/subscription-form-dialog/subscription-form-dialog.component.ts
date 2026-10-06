import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  UpdateSubscriptionRequest,
} from '../../models/subscription.model';
import { FREQUENCY_LABELS, Frequency, PAYMENT_METHOD_LABELS, PaymentMethod } from '../../../../shared/models/enums';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';

export interface SubscriptionDialogData {
  subscription?: SubscriptionResponse;
}

@Component({
  selector: 'app-subscription-form-dialog',
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
  templateUrl: './subscription-form-dialog.component.html',
  styleUrl: './subscription-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<SubscriptionFormDialogComponent, CreateSubscriptionRequest | UpdateSubscriptionRequest>,
  );
  readonly data = inject<SubscriptionDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly categoriesState = inject(CategoriesStateService);
  readonly accountsState = inject(AccountsStateService);

  readonly isEdit = !!this.data?.subscription;

  readonly frequencyOptions = [
    { value: Frequency.Weekly, label: FREQUENCY_LABELS[Frequency.Weekly] },
    { value: Frequency.Biweekly, label: FREQUENCY_LABELS[Frequency.Biweekly] },
    { value: Frequency.Monthly, label: FREQUENCY_LABELS[Frequency.Monthly] },
    { value: Frequency.Bimonthly, label: FREQUENCY_LABELS[Frequency.Bimonthly] },
    { value: Frequency.Quarterly, label: FREQUENCY_LABELS[Frequency.Quarterly] },
    { value: Frequency.Semiannual, label: FREQUENCY_LABELS[Frequency.Semiannual] },
    { value: Frequency.Yearly, label: FREQUENCY_LABELS[Frequency.Yearly] },
  ];

  readonly paymentMethodOptions = [
    { value: PaymentMethod.Cash, label: PAYMENT_METHOD_LABELS[PaymentMethod.Cash] },
    { value: PaymentMethod.Debit, label: PAYMENT_METHOD_LABELS[PaymentMethod.Debit] },
    { value: PaymentMethod.CreditCard, label: PAYMENT_METHOD_LABELS[PaymentMethod.CreditCard] },
    { value: PaymentMethod.Pix, label: PAYMENT_METHOD_LABELS[PaymentMethod.Pix] },
    { value: PaymentMethod.Transfer, label: PAYMENT_METHOD_LABELS[PaymentMethod.Transfer] },
  ];

  readonly form = new FormGroup({
    description: new FormControl<string>(this.data?.subscription?.description ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s0-9\-_]+$/),
      ],
    }),
    amount: new FormControl<number | null>(this.data?.subscription?.amount ?? null, {
      validators: [Validators.required, Validators.min(0.01), Validators.max(9999999999)],
    }),
    frequency: new FormControl<Frequency>(
      this.data?.subscription?.frequency ?? Frequency.Monthly,
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    nextDueDate: new FormControl<string>(
      this.data?.subscription?.nextDueDate
        ? this.data.subscription.nextDueDate.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    accountId: new FormControl<string>('', {
      nonNullable: true,
      validators: this.isEdit ? [] : [Validators.required],
    }),
    categoryId: new FormControl<string>('', {
      nonNullable: true,
      validators: this.isEdit ? [] : [Validators.required],
    }),
    paymentMethod: new FormControl<PaymentMethod>(PaymentMethod.CreditCard, {
      nonNullable: true,
      validators: this.isEdit ? [] : [Validators.required],
    }),
    isActive: new FormControl<boolean>(this.data?.subscription?.isActive ?? true, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    if (!this.isEdit) {
      this.categoriesState.loadCategories();
      this.accountsState.loadAccounts();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const isoDate = new Date(`${raw.nextDueDate}T12:00:00Z`).toISOString();

    if (this.isEdit) {
      const updatePayload: UpdateSubscriptionRequest = {
        description: raw.description.trim(),
        amount: Number(raw.amount),
        frequency: raw.frequency,
        nextDueDate: isoDate,
        isActive: raw.isActive,
      };
      this.dialogRef.close(updatePayload);
      return;
    }

    const createPayload: CreateSubscriptionRequest = {
      description: raw.description.trim(),
      amount: Number(raw.amount),
      frequency: raw.frequency,
      nextDueDate: isoDate,
      accountId: raw.accountId,
      categoryId: raw.categoryId,
      paymentMethod: raw.paymentMethod,
    };
    this.dialogRef.close(createPayload);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
