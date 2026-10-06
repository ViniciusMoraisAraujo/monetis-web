import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'theme';
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const saved = localStorage.getItem(this.storageKey);
    let isDark = false;

    if (saved === 'dark') {
      isDark = true;
    } else if (saved === 'light') {
      isDark = false;
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
      if (isDark) {
        root.classList.remove('light');
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
      }
    }

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
    }
  }
}
