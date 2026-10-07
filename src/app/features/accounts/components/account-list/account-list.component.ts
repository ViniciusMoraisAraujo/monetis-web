import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import '../../../../core/i18n';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountType, ACCOUNT_TYPE_LABELS } from '../../../../shared/models/enums';
import {
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../../models/account.model';
import { AccountsStateService } from '../../services/accounts-state.service';
import { AccountFormDialogComponent } from '../account-form-dialog/account-form-dialog.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  readonly accountsState = inject(AccountsStateService);

  readonly accountTypeLabels = ACCOUNT_TYPE_LABELS;

  ngOnInit(): void {
    this.accountsState.loadAccounts();
  }

  getAccountTypeIcon(type: AccountType): string {
    switch (type) {
      case AccountType.Saving:
        return 'savings';
      case AccountType.CreditCard:
        return 'credit_card';
      case AccountType.Checking:
      default:
        return 'account_balance';
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open<AccountFormDialogComponent, unknown, CreateAccountRequest>(
      AccountFormDialogComponent,
      {
        width: '420px',
        maxWidth: '90vw',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.accountsState.createAccount(result);
      }
    });
  }

  openEditDialog(account: AccountResponse): void {
    const dialogRef = this.dialog.open<
      AccountFormDialogComponent,
      { account: AccountResponse },
      UpdateAccountRequest
    >(AccountFormDialogComponent, {
      width: '420px',
      maxWidth: '90vw',
      data: { account },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.accountsState.updateAccount(account.id, result);
      }
    });
  }

  onDelete(account: AccountResponse): void {
    if (confirm(`Tem certeza que deseja excluir a conta "${account.name}"?`)) {
      this.accountsState.deleteAccount(account.id);
    }
  }
}
