import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import '../../../../core/i18n';
import { SubscriptionsStateService } from '../../services/subscriptions-state.service';
import {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  UpdateSubscriptionRequest,
} from '../../models/subscription.model';
import { FREQUENCY_LABELS } from '../../../../shared/models/enums';
import { SubscriptionFormDialogComponent } from '../subscription-form-dialog/subscription-form-dialog.component';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionListComponent implements OnInit {
  readonly state = inject(SubscriptionsStateService);
  private readonly dialog = inject(MatDialog);

  readonly frequencyLabels = FREQUENCY_LABELS;

  ngOnInit(): void {
    this.state.loadSubscriptions();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SubscriptionFormDialogComponent, {
      width: '100%',
      maxWidth: '480px',
    });

    dialogRef.afterClosed().subscribe((result: CreateSubscriptionRequest | undefined) => {
      if (result) {
        this.state.createSubscription(result).subscribe();
      }
    });
  }

  openEditDialog(sub: SubscriptionResponse): void {
    const dialogRef = this.dialog.open(SubscriptionFormDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      data: { subscription: sub },
    });

    dialogRef.afterClosed().subscribe((result: UpdateSubscriptionRequest | undefined) => {
      if (result) {
        this.state.updateSubscription(sub.id, result).subscribe();
      }
    });
  }

  onDelete(sub: SubscriptionResponse): void {
    if (confirm(`Deseja realmente cancelar e excluir a assinatura "${sub.description}"?`)) {
      this.state.deleteSubscription(sub.id).subscribe();
    }
  }
}
