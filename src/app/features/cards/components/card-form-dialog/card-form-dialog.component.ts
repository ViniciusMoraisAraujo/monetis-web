import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardResponse, CreateCardRequest } from '../../models/card.model';

export interface CardDialogData {
  card?: CardResponse;
}

@Component({
  selector: 'app-card-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './card-form-dialog.component.html',
  styleUrl: './card-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CardFormDialogComponent>);
  readonly data = inject<CardDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly isEdit = !!this.data?.card;

  readonly form = new FormGroup({
    name: new FormControl<string>(this.data?.card?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value: CreateCardRequest = {
      name: this.form.controls.name.value.trim(),
    };

    this.dialogRef.close(value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
