import { TestBed } from '@angular/core/testing';
import { PrivacyService } from './privacy.service';

describe('PrivacyService', () => {
  let service: PrivacyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivacyService);
  });

  it('should be created and default to values visible', () => {
    expect(service).toBeTruthy();
    expect(service.isValuesVisible()).toBe(true);
    expect(service.ariaLabel()).toBe('Ocultar valores');
    expect(service.ariaPressed()).toBe(false);
  });

  it('should toggle visibility when toggleValuesVisibility is called', () => {
    service.toggleValuesVisibility();
    expect(service.isValuesVisible()).toBe(false);
    expect(service.ariaLabel()).toBe('Mostrar valores');
    expect(service.ariaPressed()).toBe(true);

    service.toggleValuesVisibility();
    expect(service.isValuesVisible()).toBe(true);
    expect(service.ariaLabel()).toBe('Ocultar valores');
    expect(service.ariaPressed()).toBe(false);
  });

  it('should mask values with bullet points when hidden and return original value when visible', () => {
    expect(service.maskValue('R$ 1.250,00')).toBe('R$ 1.250,00');

    service.toggleValuesVisibility();
    expect(service.maskValue('R$ 1.250,00')).toBe('••••••');
  });
});
