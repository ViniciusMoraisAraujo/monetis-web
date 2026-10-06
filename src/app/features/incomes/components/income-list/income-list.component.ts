import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
import { IncomesStateService } from '../../services/incomes-state.service';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import {
  CreateIncomeRequest,
  IncomeFilterParams,
  IncomeResponse,
  UpdateIncomeRequest,
} from '../../models/income.model';
import { IncomeFormDialogComponent } from '../income-form-dialog/income-form-dialog.component';

@Component({
  selector: 'app-income-list',
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
  templateUrl: './income-list.component.html',
  styleUrl: './income-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeListComponent implements OnInit {
  readonly state = inject(IncomesStateService);
  readonly categoriesState = inject(CategoriesStateService);
  private readonly dialog = inject(MatDialog);

  readonly filterStatus = new FormControl<'all' | 'received' | 'pending'>('all', { nonNullable: true });
  readonly filterCategory = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.state.loadIncomes();
    this.categoriesState.loadCategories();
  }

  applyFilters(): void {
    const status = this.filterStatus.value;
    const categoryId = this.filterCategory.value || undefined;

    let isReceived: boolean | undefined = undefined;
    if (status === 'received') isReceived = true;
    if (status === 'pending') isReceived = false;

    const filters: IncomeFilterParams = {
      isReceived,
      categoryId,
    };

    this.state.loadIncomes(filters);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(IncomeFormDialogComponent, {
      width: '100%',
      maxWidth: '520px',
    });

    dialogRef.afterClosed().subscribe((result: CreateIncomeRequest | undefined) => {
      if (result) {
        this.state.createIncome(result).subscribe();
      }
    });
  }

  openEditDialog(income: IncomeResponse): void {
    const dialogRef = this.dialog.open(IncomeFormDialogComponent, {
      width: '100%',
      maxWidth: '520px',
      data: { income },
    });

    dialogRef.afterClosed().subscribe((result: UpdateIncomeRequest | undefined) => {
      if (result) {
        this.state.updateIncome(income.id, result).subscribe();
      }
    });
  }

  onReceive(income: IncomeResponse): void {
    this.state.receiveIncome(income.id).subscribe();
  }

  onDelete(income: IncomeResponse): void {
    if (confirm(`Deseja realmente excluir a receita "${income.description}"?`)) {
      this.state.deleteIncome(income.id).subscribe();
    }
  }
}
