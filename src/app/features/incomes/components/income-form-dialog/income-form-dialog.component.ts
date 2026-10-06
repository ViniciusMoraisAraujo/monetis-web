import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateIncomeRequest, IncomeResponse, UpdateIncomeRequest } from '../../models/income.model';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';

export interface IncomeDialogData {
  income?: IncomeResponse;
}

@Component({
  selector: 'app-income-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './income-form-dialog.component.html',
  styleUrl: './income-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<IncomeFormDialogComponent, CreateIncomeRequest | UpdateIncomeRequest>);
  readonly data = inject<IncomeDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly categoriesState = inject(CategoriesStateService);
  readonly accountsState = inject(AccountsStateService);

  readonly isEdit = !!this.data?.income;

  readonly form = new FormGroup({
    description: new FormControl<string>(this.data?.income?.description ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    amount: new FormControl<number | null>(this.data?.income?.amount ?? null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    date: new FormControl<string>(
      this.data?.income?.date ? this.data.income.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    categoryId: new FormControl<string>(this.data?.income?.categoryId ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    accountId: new FormControl<string>(this.data?.income?.accountId ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.categoriesState.loadCategories();
    this.accountsState.loadAccounts();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const isoDate = new Date(`${raw.date}T12:00:00Z`).toISOString();

    const payload: CreateIncomeRequest = {
      description: raw.description.trim(),
      amount: Number(raw.amount),
      date: isoDate,
      categoryId: raw.categoryId,
      accountId: raw.accountId,
    };

    this.dialogRef.close(payload);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
