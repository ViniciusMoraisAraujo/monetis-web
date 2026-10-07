import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryResponse } from '../../models/category.model';

const CATEGORY_NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s]+$/;

export interface CategoryDialogData {
  category?: CategoryResponse;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CategoryFormDialogComponent>);
  readonly data = inject<CategoryDialogData | null>(MAT_DIALOG_DATA, { optional: true });

  readonly isEditMode = !!this.data?.category;
  readonly dialogTitle = this.isEditMode ? 'Editar Categoria' : 'Nova Categoria';

  readonly form = new FormGroup({
    name: new FormControl(this.data?.category?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(CATEGORY_NAME_PATTERN),
      ],
    }),
    icon: new FormControl(this.data?.category?.icon ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(15)],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
