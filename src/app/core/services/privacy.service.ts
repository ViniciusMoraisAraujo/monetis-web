import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrivacyService {
  readonly isValuesVisible = signal<boolean>(true);

  readonly ariaLabel = computed(() =>
    this.isValuesVisible() ? 'Ocultar valores' : 'Mostrar valores',
  );

  readonly ariaPressed = computed(() => !this.isValuesVisible());

  toggleValuesVisibility(): void {
    this.isValuesVisible.update((visible) => !visible);
  }

  maskValue(value: string): string {
    return this.isValuesVisible() ? value : '••••••';
  }
}
