import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ErrorToastService } from '../../services/error-toast.service';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastComponent {
  readonly toastService = inject(ErrorToastService);

  onRetry(): void {
    this.toastService.retry();
  }

  onDismiss(): void {
    this.toastService.dismiss();
  }
}
