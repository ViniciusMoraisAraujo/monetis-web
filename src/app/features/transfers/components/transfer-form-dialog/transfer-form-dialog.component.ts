import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateTransferRequest } from '../../models/transfer.model';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';

export const differentAccountsValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const from = control.get('fromAccountId')?.value;
  const to = control.get('toAccountId')?.value;

  if (from && to && from === to) {
    return { sameAccount: true };
  }
  return null;
};

@Component({
  selector: 'app-transfer-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './transfer-form-dialog.component.html',
  styleUrl: './transfer-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<TransferFormDialogComponent, CreateTransferRequest>,
  );
  readonly accountsState = inject(AccountsStateService);

  readonly form = new FormGroup(
    {
      fromAccountId: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      toAccountId: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amount: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(0.01)],
      }),
      date: new FormControl<string>(new Date().toISOString().substring(0, 10), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.maxLength(150)],
      }),
    },
    { validators: [differentAccountsValidator] },
  );

  ngOnInit(): void {
    this.accountsState.loadAccounts();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const isoDate = new Date(`${raw.date}T12:00:00Z`).toISOString();

    const payload: CreateTransferRequest = {
      fromAccountId: raw.fromAccountId,
      toAccountId: raw.toAccountId,
      amount: Number(raw.amount),
      date: isoDate,
      description: raw.description.trim() || undefined,
    };

    this.dialogRef.close(payload);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
