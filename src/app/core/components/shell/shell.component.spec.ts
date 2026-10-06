import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let authServiceMock: {
    logout: ReturnType<typeof vi.fn>;
    currentUser: ReturnType<typeof signal<{ id: string; email: string } | null>>;
  };
  let themeServiceMock: {
    isDarkMode: ReturnType<typeof signal<boolean>>;
    toggleTheme: ReturnType<typeof vi.fn>;
  };
  let breakpointSubject: BehaviorSubject<BreakpointState>;
  let router: Router;

  beforeEach(async () => {
    breakpointSubject = new BehaviorSubject<BreakpointState>({
      matches: false,
      breakpoints: {}
    });

    authServiceMock = {
      logout: vi.fn(),
      currentUser: signal({ id: 'user-1', email: 'test@example.com' })
    };

    themeServiceMock = {
      isDarkMode: signal(false),
      toggleTheme: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        {
          provide: BreakpointObserver,
          useValue: {
            observe: () => breakpointSubject.asObservable()
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create shell component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme when theme button is clicked', () => {
    component.onToggleTheme();
    expect(themeServiceMock.toggleTheme).toHaveBeenCalled();
  });

  it('should logout and redirect to /auth/login when logout is clicked', () => {
    component.onLogout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should detect desktop mode when breakpoint observer matches', () => {
    breakpointSubject.next({ matches: true, breakpoints: {} });
    fixture.detectChanges();
    expect(component.isDesktop()).toBe(true);
  });
});
