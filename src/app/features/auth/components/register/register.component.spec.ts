import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authStateMock: {
    isLoading: ReturnType<typeof signal<boolean>>;
    errorMessage: ReturnType<typeof signal<string | null>>;
    register: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authStateMock = {
      isLoading: signal(false),
      errorMessage: signal(null),
      register: vi.fn(),
      clearError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([]), { provide: AuthStateService, useValue: authStateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create register component with invalid empty form', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBe(false);
  });

  it('should validate name, email and password constraints', () => {
    const firstName = component.form.controls.firstName;
    const lastName = component.form.controls.lastName;
    const email = component.form.controls.email;
    const password = component.form.controls.password;

    firstName.setValue('123'); // invalid characters
    expect(firstName.valid).toBe(false);

    firstName.setValue('João');
    expect(firstName.valid).toBe(true);

    lastName.setValue('Silva');
    expect(lastName.valid).toBe(true);

    email.setValue('invalid-email');
    expect(email.valid).toBe(false);

    email.setValue('joao@example.com');
    expect(email.valid).toBe(true);

    password.setValue('weak');
    expect(password.valid).toBe(false);

    password.setValue('Strong@Pass1');
    expect(password.valid).toBe(true);

    expect(component.form.valid).toBe(true);
  });

  it('should call authState.register when form is valid', async () => {
    component.form.setValue({
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: 'Strong@Pass1',
    });

    await component.onSubmit();

    expect(authStateMock.register).toHaveBeenCalledWith({
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: 'Strong@Pass1',
    });
  });

  it('should display error message when authState.errorMessage is set', () => {
    authStateMock.errorMessage.set('Email já existente');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const alertEl = compiled.querySelector('[role="alert"]');
    expect(alertEl?.textContent).toContain('Email já existente');
  });
});
