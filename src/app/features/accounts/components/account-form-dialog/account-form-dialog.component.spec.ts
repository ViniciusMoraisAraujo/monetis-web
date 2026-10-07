import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountType } from '../../../../shared/models/enums';
import { AccountFormDialogComponent } from './account-form-dialog.component';

describe('AccountFormDialogComponent', () => {
  let component: AccountFormDialogComponent;
  let fixture: ComponentFixture<AccountFormDialogComponent>;
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };

  describe('Create Mode', () => {
    beforeEach(async () => {
      dialogRefMock = { close: vi.fn() };

      await TestBed.configureTestingModule({
        imports: [AccountFormDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefMock },
          { provide: MAT_DIALOG_DATA, useValue: null },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountFormDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize form for creating account', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.form.valid).toBe(false);
      expect(component.dialogTitle).toBe('Nova Conta');
    });

    it('should validate account name format and require type', () => {
      const name = component.form.controls.name;
      const type = component.form.controls.type;

      name.setValue('123#');
      expect(name.valid).toBe(false);

      name.setValue('Conta Corrente Nubank');
      expect(name.valid).toBe(true);

      type.setValue(AccountType.Checking);
      expect(type.valid).toBe(true);

      expect(component.form.valid).toBe(true);
    });

    it('should close dialog with form data on valid submit', () => {
      component.form.setValue({
        name: 'Nubank',
        type: AccountType.Checking,
      });

      component.onSubmit();

      expect(dialogRefMock.close).toHaveBeenCalledWith({
        name: 'Nubank',
        type: AccountType.Checking,
      });
    });

    it('should close dialog on cancel', () => {
      component.onCancel();
      expect(dialogRefMock.close).toHaveBeenCalledWith();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      dialogRefMock = { close: vi.fn() };

      await TestBed.configureTestingModule({
        imports: [AccountFormDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefMock },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              account: {
                id: 'acc-1',
                name: 'Banco do Brasil',
                type: AccountType.Checking,
                balance: 100,
              },
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountFormDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize form for editing account', () => {
      expect(component.isEditMode).toBe(true);
      expect(component.dialogTitle).toBe('Editar Conta');
      expect(component.form.controls.name.value).toBe('Banco do Brasil');
    });
  });
});
