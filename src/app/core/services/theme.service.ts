import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'theme';
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const saved = localStorage.getItem(this.storageKey);
    let isDark = true;

    if (saved === 'dark') {
      isDark = true;
    } else if (saved === 'light') {
      isDark = false;
    } else if (typeof window !== 'undefined' && 'matchMedia' in window) {
      // Se não houver configuração salva, preferência Dark-First padrão
      isDark = true;
    }

    this.applyTheme(isDark, false);
  }

  toggleTheme(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  setDarkMode(isDark: boolean): void {
    this.applyTheme(isDark, true);
  }

  private applyTheme(isDark: boolean, persist: boolean): void {
    this.isDarkMode.set(isDark);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;

      if (isDark) {
        root.classList.remove('light');
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
        if (body) {
          body.classList.remove('light');
          body.classList.add('dark');
        }
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
        if (body) {
          body.classList.remove('dark');
          body.classList.add('light');
        }
      }
    }

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
    }
  }
}
