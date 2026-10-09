import { TestBed } from '@angular/core/testing';
import { ErrorToastService } from './error-toast.service';

describe('ErrorToastService', () => {
  let service: ErrorToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created with default invisible state', () => {
    expect(service).toBeTruthy();
    expect(service.isVisible()).toBe(false);
  });

  it('should show toast with default values and auto-dismiss after duration', () => {
    service.show();
    expect(service.isVisible()).toBe(true);
    expect(service.title()).toBe('Falha de sincronização');
    expect(service.message()).toBe('Não foi possível carregar os dados financeiros mais recentes.');

    vi.advanceTimersByTime(10000);
    expect(service.isVisible()).toBe(false);
  });

  it('should execute retry callback and dismiss toast on retry', () => {
    const retryFn = vi.fn();
    service.show({ retryAction: retryFn });

    expect(service.isVisible()).toBe(true);
    service.retry();

    expect(retryFn).toHaveBeenCalled();
    expect(service.isVisible()).toBe(false);
  });

  it('should dismiss manually when dismiss is called', () => {
    service.show();
    expect(service.isVisible()).toBe(true);
    service.dismiss();
    expect(service.isVisible()).toBe(false);
  });
});
