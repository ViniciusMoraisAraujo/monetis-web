import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../models/category.model';
import { CategoriesStateService } from '../../services/categories-state.service';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  readonly categoriesState = inject(CategoriesStateService);

  ngOnInit(): void {
    this.categoriesState.loadCategories();
  }

  isSystemCategory(category: CategoryResponse): boolean {
    return !category.userId;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open<CategoryFormDialogComponent, unknown, CreateCategoryRequest>(
      CategoryFormDialogComponent,
      {
        width: '420px',
        maxWidth: '90vw',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriesState.createCategory(result);
      }
    });
  }

  openEditDialog(category: CategoryResponse): void {
    const dialogRef = this.dialog.open<
      CategoryFormDialogComponent,
      { category: CategoryResponse },
      UpdateCategoryRequest
    >(CategoryFormDialogComponent, {
      width: '420px',
      maxWidth: '90vw',
      data: { category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriesState.updateCategory(category.id, result);
      }
    });
  }

  onDelete(category: CategoryResponse): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      this.categoriesState.deleteCategory(category.id);
    }
  }
}
