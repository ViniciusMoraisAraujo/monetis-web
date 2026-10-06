import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardFormDialogComponent } from './card-form-dialog.component';
import { CardResponse } from '../../models/card.model';

describe('CardFormDialogComponent', () => {
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dialogRefMock = { close: vi.fn() };
  });

  const createComponent = (data?: { card?: CardResponse }) => {
    TestBed.configureTestingModule({
      imports: [CardFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data ?? {} },
      ],
    });

    const fixture = TestBed.createComponent(CardFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  };

  it('should initialize form for creating card with empty values', () => {
    const { component } = createComponent();
    expect(component.isEdit).toBe(false);
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.valid).toBe(false);
  });

  it('should initialize form for editing card with existing values', () => {
    const existingCard: CardResponse = { id: 'c-1', name: 'Nubank Ultravioleta', userId: 'u-1' };
    const { component } = createComponent({ card: existingCard });

    expect(component.isEdit).toBe(true);
    expect(component.form.controls.name.value).toBe('Nubank Ultravioleta');
    expect(component.form.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    const { component } = createComponent();
    component.onSubmit();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close dialog with form value on valid submit', () => {
    const { component } = createComponent();
    component.form.controls.name.setValue('C6 Carbon Black');

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      name: 'C6 Carbon Black',
    });
  });

  it('should close dialog without value on cancel', () => {
    const { component } = createComponent();
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });
});
