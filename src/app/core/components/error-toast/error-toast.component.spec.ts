import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { ErrorToastComponent } from './error-toast.component';
import { ErrorToastService } from '../../services/error-toast.service';

describe('ErrorToastComponent', () => {
  let component: ErrorToastComponent;
  let fixture: ComponentFixture<ErrorToastComponent>;
  let toastServiceMock: {
    isVisible: ReturnType<typeof signal<boolean>>;
    title: ReturnType<typeof signal<string>>;
    message: ReturnType<typeof signal<string>>;
    retry: ReturnType<typeof vi.fn>;
    dismiss: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    toastServiceMock = {
      isVisible: signal(true),
      title: signal('Falha de sincronização'),
      message: signal('Não foi possível carregar os dados financeiros mais recentes.'),
      retry: vi.fn(),
      dismiss: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ErrorToastComponent],
      providers: [{ provide: ErrorToastService, useValue: toastServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render toast when isVisible is true', () => {
    const toastEl = fixture.debugElement.query(By.css('.error-toast'));
    expect(toastEl).toBeTruthy();
    expect(toastEl.nativeElement.textContent).toContain('Falha de sincronização');
    expect(toastEl.nativeElement.textContent).toContain(
      'Não foi possível carregar os dados financeiros mais recentes.',
    );
  });

  it('should not render toast when isVisible is false', () => {
    toastServiceMock.isVisible.set(false);
    fixture.detectChanges();
    const toastEl = fixture.debugElement.query(By.css('.error-toast'));
    expect(toastEl).toBeFalsy();
  });

  it('should call toastService.retry when retry button is clicked', () => {
    const retryBtn = fixture.debugElement.query(By.css('.retry-btn'));
    retryBtn.nativeElement.click();
    expect(toastServiceMock.retry).toHaveBeenCalled();
  });

  it('should call toastService.dismiss when close button is clicked', () => {
    const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
    closeBtn.nativeElement.click();
    expect(toastServiceMock.dismiss).toHaveBeenCalled();
  });
});
