import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CardResponse, CreateCardRequest } from '../../models/card.model';
import { CardsStateService } from '../../services/cards-state.service';
import { CardFormDialogComponent } from '../card-form-dialog/card-form-dialog.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent implements OnInit {
  readonly state = inject(CardsStateService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.state.loadCards();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CardFormDialogComponent, {
      width: '100%',
      maxWidth: '440px',
    });

    dialogRef.afterClosed().subscribe((result: CreateCardRequest | undefined) => {
      if (result) {
        this.state.createCard(result).subscribe();
      }
    });
  }

  openEditDialog(card: CardResponse): void {
    const dialogRef = this.dialog.open(CardFormDialogComponent, {
      width: '100%',
      maxWidth: '440px',
      data: { card },
    });

    dialogRef.afterClosed().subscribe((result: CreateCardRequest | undefined) => {
      if (result) {
        this.state.updateCard(card.id, result).subscribe();
      }
    });
  }

  onDelete(card: CardResponse): void {
    if (confirm(`Deseja realmente excluir o cartão "${card.name}"?`)) {
      this.state.deleteCard(card.id).subscribe();
    }
  }
}
