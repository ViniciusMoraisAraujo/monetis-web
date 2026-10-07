import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import '../../../../core/i18n';
import { TransfersStateService } from '../../services/transfers-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { CreateTransferRequest, TransferResponse } from '../../models/transfer.model';
import { TransferFormDialogComponent } from '../transfer-form-dialog/transfer-form-dialog.component';

@Component({
  selector: 'app-transfer-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  templateUrl: './transfer-list.component.html',
  styleUrl: './transfer-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferListComponent implements OnInit {
  readonly state = inject(TransfersStateService);
  readonly accountsState = inject(AccountsStateService);
  private readonly dialog = inject(MatDialog);

  readonly filterAccount = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.state.loadTransfers();
    this.accountsState.loadAccounts();
  }

  applyFilter(): void {
    const accountId = this.filterAccount.value || undefined;
    this.state.loadTransfers({ accountId });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TransferFormDialogComponent, {
      width: '100%',
      maxWidth: '480px',
    });

    dialogRef.afterClosed().subscribe((result: CreateTransferRequest | undefined) => {
      if (result) {
        this.state.createTransfer(result).subscribe();
      }
    });
  }

  onDelete(transfer: TransferResponse): void {
    if (
      confirm(
        `Deseja estornar a transferência de ${transfer.amount} entre "${transfer.fromAccountName}" e "${transfer.toAccountName}"?`,
      )
    ) {
      this.state.deleteTransfer(transfer.id).subscribe();
    }
  }
}
