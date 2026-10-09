import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserResponse } from '../../models/user.model';
import { UsersStateService } from '../../services/users-state.service';
import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let router: Router;

  const mockUser: UserResponse = {
    id: 'user-guid-123',
    firstName: 'Vinicius',
    lastName: 'Araujo',
    email: 'vinicius@monetis.dev',
  };

  const userSignal = signal<UserResponse | null>(null);
  const isLoadingSignal = signal<boolean>(false);
  const errorMessageSignal = signal<string | null>(null);
  const fullNameSignal = signal<string>('Vinicius Araujo');
  const userInitialSignal = signal<string>('V');

  const usersStateMock = {
    user: userSignal,
    isLoading: isLoadingSignal,
    errorMessage: errorMessageSignal,
    fullName: fullNameSignal,
    userInitial: userInitialSignal,
    loadUser: vi.fn(),
    updateUser: vi.fn(),
  };

  const authServiceMock = {
    currentUser: signal({ id: 'user-guid-123', email: 'vinicius@monetis.dev' }),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    userSignal.set(null);
    isLoadingSignal.set(false);
    errorMessageSignal.set(null);
    usersStateMock.loadUser.mockReset();
    usersStateMock.updateUser.mockReset();

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: UsersStateService, useValue: usersStateMock },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'user-guid-123' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should initialize and load user data by route id', () => {
    fixture.detectChanges();

    expect(usersStateMock.loadUser).toHaveBeenCalledWith('user-guid-123');
  });

  it('should display loading skeleton when loading and user is not yet present', () => {
    isLoadingSignal.set(true);
    userSignal.set(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skeleton-avatar')).toBeTruthy();
  });

  it('should display error state when errorMessage is present', () => {
    errorMessageSignal.set('Usuário não encontrado');
    userSignal.set(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Não foi possível carregar os dados da conta');
    expect(compiled.textContent).toContain('Usuário não encontrado');
  });

  it('should display user account details when user is loaded', () => {
    userSignal.set(mockUser);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Vinicius Araujo');
    expect(compiled.textContent).toContain('vinicius@monetis.dev');
    expect(compiled.textContent).toContain('user-guid-123');
    expect(compiled.textContent).toContain('Informações Cadastrais');
  });

  it('should toggle edit form and allow updating user profile', async () => {
    userSignal.set(mockUser);
    usersStateMock.updateUser.mockResolvedValue(true);
    fixture.detectChanges();

    expect(component.isEditing()).toBe(false);
    component.onToggleEdit();
    fixture.detectChanges();

    expect(component.isEditing()).toBe(true);
    expect(component.form.value.firstName).toBe('Vinicius');

    component.form.patchValue({ lastName: 'Silva' });
    await component.onSaveProfile();

    expect(usersStateMock.updateUser).toHaveBeenCalledWith('user-guid-123', {
      firstName: 'Vinicius',
      lastName: 'Silva',
      email: 'vinicius@monetis.dev',
    });
    expect(component.isEditing()).toBe(false);
  });

  it('should call authService.logout and navigate on logout', () => {
    userSignal.set(mockUser);
    const navSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    component.onLogout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
