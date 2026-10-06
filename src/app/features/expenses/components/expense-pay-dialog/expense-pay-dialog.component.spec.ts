import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { ExpensePayDialogComponent } from './expense-pay-dialog.component';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { ExpenseResponse } from '../../models/expense.model';
import { PaymentMethod } from '../../../../shared/models/enums';

describe('ExpensePayDialogComponent', () => {
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };
  let accountsStateMock: { accounts: ReturnType<typeof signal<any[]>>; loadAccounts: ReturnType<typeof vi.fn> };

  const mockExpense: ExpenseResponse = {
    id: 'e-1',
    description: 'Internet',
    amount: 150,
    date: '2026-10-06T12:00:00Z',
    paymentMethod: PaymentMethod.Pix,
    categoryId: 'cat-1',
    categoryName: 'Serviços',
    accountId: null,
    isPaid: false,
    isInstallment: false,
    isSubscription: false,
    createdAt: '2026-10-06T12:00:00Z',
  };

  beforeEach(() => {
    dialogRefMock = { close: vi.fn() };
    accountsStateMock = {
      accounts: signal([
        { id: 'acc-1', name: 'Nubank', balance: 500, type: 0 },
      ]),
      loadAccounts: vi.fn(),
    };
  });

  const createComponent = (expense = mockExpense) => {
    TestBed.configureTestingModule({
      imports: [ExpensePayDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { expense } },
        { provide: AccountsStateService, useValue: accountsStateMock },
      ],
    });

    const fixture = TestBed.createComponent(ExpensePayDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  };

  it('should initialize and require account when expense has no account', () => {
    const { component } = createComponent();
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.accountId.hasError('required')).toBe(true);
  });

  it('should not require account when expense already has an account', () => {
    const expenseWithAcc = { ...mockExpense, accountId: 'acc-1' };
    const { component } = createComponent(expenseWithAcc);
    expect(component.form.valid).toBe(true);
  });

  it('should close dialog with pay payload on valid submit', () => {
    const { component } = createComponent();
    component.form.controls.accountId.setValue('acc-1');
    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 'acc-1',
      }),
    );
  });
});
