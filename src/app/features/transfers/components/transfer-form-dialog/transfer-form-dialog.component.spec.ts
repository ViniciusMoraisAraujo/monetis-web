import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { TransferFormDialogComponent } from './transfer-form-dialog.component';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';

describe('TransferFormDialogComponent', () => {
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };
  let accountsStateMock: {
    accounts: ReturnType<typeof signal<any[]>>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    dialogRefMock = { close: vi.fn() };
    accountsStateMock = {
      accounts: signal([
        { id: 'acc-1', name: 'Nubank', balance: 2000 },
        { id: 'acc-2', name: 'Inter', balance: 500 },
      ]),
      loadAccounts: vi.fn(),
    };
  });

  const createComponent = () => {
    TestBed.configureTestingModule({
      imports: [TransferFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AccountsStateService, useValue: accountsStateMock },
      ],
    });

    const fixture = TestBed.createComponent(TransferFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  };

  it('should initialize form with empty values and load accounts', () => {
    const { component } = createComponent();
    expect(component.form.valid).toBe(false);
    expect(accountsStateMock.loadAccounts).toHaveBeenCalled();
  });

  it('should mark form invalid if fromAccountId and toAccountId are identical', () => {
    const { component } = createComponent();
    component.form.patchValue({
      fromAccountId: 'acc-1',
      toAccountId: 'acc-1',
      amount: 100,
      date: '2026-10-06',
    });

    expect(component.form.hasError('sameAccount')).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('should submit transfer when form is valid with different accounts', () => {
    const { component } = createComponent();
    component.form.patchValue({
      fromAccountId: 'acc-1',
      toAccountId: 'acc-2',
      amount: 300,
      date: '2026-10-06',
      description: 'Transferência de reserva',
    });

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith(
      expect.objectContaining({
        fromAccountId: 'acc-1',
        toAccountId: 'acc-2',
        amount: 300,
        description: 'Transferência de reserva',
      }),
    );
  });
});
