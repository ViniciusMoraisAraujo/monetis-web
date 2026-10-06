import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let themeMock: {
    isDarkMode: ReturnType<typeof signal<boolean>>;
    toggleTheme: ReturnType<typeof vi.fn>;
  };
  let element: HTMLElement;

  beforeEach(async () => {
    themeMock = {
      isDarkMode: signal(true),
      toggleTheme: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([]), { provide: ThemeService, useValue: themeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create the home page component', () => {
    expect(component).toBeTruthy();
  });

  it('should present the product with a headline and a lead mentioning Monetis', () => {
    const headline = element.querySelector('h1');
    const lead = element.querySelector('.hero-lead');

    expect(headline?.textContent).toContain('vida financeira');
    expect(lead?.textContent).toContain('Monetis');
  });

  it('should render one feature card per product module', () => {
    const cards = element.querySelectorAll('.feature-card');

    expect(cards.length).toBe(6);
    expect(element.textContent).toContain('Contas');
    expect(element.textContent).toContain('Cartões');
    expect(element.textContent).toContain('Assinaturas');
  });

  it('should render the three onboarding steps', () => {
    const steps = element.querySelectorAll('.step-item');

    expect(steps.length).toBe(3);
    expect(element.textContent).toContain('Criar sua conta');
  });

  it('should link to the login and register routes', () => {
    expect(element.querySelector('a[href="/auth/login"]')).toBeTruthy();
    expect(element.querySelector('a[href="/auth/register"]')).toBeTruthy();
  });

  it('should toggle the theme when the theme button is clicked', () => {
    const themeButton = element.querySelector<HTMLButtonElement>('.theme-button');

    expect(themeButton).toBeTruthy();
    expect(themeButton?.getAttribute('aria-label')).toBe('Alternar para tema claro');

    themeButton?.click();
    fixture.detectChanges();

    expect(themeMock.toggleTheme).toHaveBeenCalledTimes(1);
  });
});
