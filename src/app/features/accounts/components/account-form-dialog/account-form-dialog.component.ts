import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AccountType, ACCOUNT_TYPE_LABELS } from '../../../../shared/models/enums';
import { AccountResponse } from '../../models/account.model';

const ACCOUNT_NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s]+$/;

export interface AccountDialogData {
  account?: AccountResponse;
}

@Component({
  selector: 'app-account-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './account-form-dialog.component.html',
  styleUrl: './account-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AccountFormDialogComponent>);
  readonly data = inject<AccountDialogData | null>(MAT_DIALOG_DATA, { optional: true });

  readonly isEditMode = !!this.data?.account;
  readonly dialogTitle = this.isEditMode ? 'Editar Conta' : 'Nova Conta';

  readonly accountTypes = [
    { value: AccountType.Checking, label: ACCOUNT_TYPE_LABELS[AccountType.Checking] },
    { value: AccountType.Saving, label: ACCOUNT_TYPE_LABELS[AccountType.Saving] },
    { value: AccountType.CreditCard, label: ACCOUNT_TYPE_LABELS[AccountType.CreditCard] },
  ];

  readonly form = new FormGroup({
    name: new FormControl(this.data?.account?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(ACCOUNT_NAME_PATTERN),
      ],
    }),
    type: new FormControl<AccountType>(this.data?.account?.type ?? AccountType.Checking, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.dialogRef.close({ name: this.form.controls.name.value });
    } else {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
