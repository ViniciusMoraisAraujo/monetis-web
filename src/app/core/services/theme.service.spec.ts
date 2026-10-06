import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.style.colorScheme = '';

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.style.colorScheme = '';
  });

  it('should initialize light mode by default when localStorage is empty and matchMedia is false', () => {
    service = TestBed.inject(ThemeService);
    expect(service.isDarkMode()).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('should initialize dark mode when localStorage has dark', () => {
    localStorage.setItem('theme', 'dark');
    service = TestBed.inject(ThemeService);
    expect(service.isDarkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('should toggle theme from light to dark and persist in localStorage', () => {
    service = TestBed.inject(ThemeService);
    expect(service.isDarkMode()).toBe(false);

    service.toggleTheme();

    expect(service.isDarkMode()).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('should set dark mode explicitly', () => {
    service = TestBed.inject(ThemeService);

    service.setDarkMode(true);
    expect(service.isDarkMode()).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    service.setDarkMode(false);
    expect(service.isDarkMode()).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});
