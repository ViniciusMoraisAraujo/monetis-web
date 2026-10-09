import { Injectable, signal } from '@angular/core';

export interface ErrorToastConfig {
  title?: string;
  message?: string;
  retryAction?: () => void;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorToastService {
  readonly isVisible = signal(false);
  readonly title = signal('Falha de sincronização');
  readonly message = signal('Não foi possível carregar os dados financeiros mais recentes.');
  private currentRetryAction: (() => void) | null = null;
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  show(config?: ErrorToastConfig): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }

    this.title.set(config?.title ?? 'Falha de sincronização');
    this.message.set(
      config?.message ?? 'Não foi possível carregar os dados financeiros mais recentes.',
    );
    this.currentRetryAction = config?.retryAction ?? null;
    this.isVisible.set(true);

    const duration = config?.durationMs ?? 10000;
    if (duration > 0) {
      this.dismissTimer = setTimeout(() => {
        this.dismiss();
      }, duration);
    }
  }

  dismiss(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.isVisible.set(false);
  }

  retry(): void {
    const action = this.currentRetryAction;
    this.dismiss();
    if (action) {
      action();
    }
  }
}
