import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authStateMock: {
    isLoading: ReturnType<typeof signal<boolean>>;
    errorMessage: ReturnType<typeof signal<string | null>>;
    login: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authStateMock = {
      isLoading: signal(false),
      errorMessage: signal(null),
      login: vi.fn(),
      clearError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthStateService, useValue: authStateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component with empty reactive form', () => {
    expect(component).toBeTruthy();
    expect(component.form.value.email).toBe('');
    expect(component.form.value.password).toBe('');
    expect(component.form.valid).toBe(false);
  });

  it('should require valid email and password', () => {
    const emailControl = component.form.controls.email;
    const passwordControl = component.form.controls.password;

    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBe(false);

    emailControl.setValue('valid@example.com');
    expect(emailControl.valid).toBe(true);

    passwordControl.setValue('12345');
    expect(passwordControl.valid).toBe(false);

    passwordControl.setValue('Password@123');
    expect(passwordControl.valid).toBe(true);

    expect(component.form.valid).toBe(true);
  });

  it('should call authState.login when form is submitted with valid data', async () => {
    component.form.setValue({
      email: 'valid@example.com',
      password: 'Password@123',
    });

    await component.onSubmit();

    expect(authStateMock.login).toHaveBeenCalledWith({
      email: 'valid@example.com',
      password: 'Password@123',
    });
  });

  it('should not call authState.login when form is invalid', async () => {
    component.form.setValue({
      email: '',
      password: '',
    });

    await component.onSubmit();

    expect(authStateMock.login).not.toHaveBeenCalled();
  });

  it('should display error message when authState.errorMessage is set', () => {
    authStateMock.errorMessage.set('Credenciais inválidas');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const alertEl = compiled.querySelector('[role="alert"]');
    expect(alertEl?.textContent).toContain('Credenciais inválidas');
  });
});
