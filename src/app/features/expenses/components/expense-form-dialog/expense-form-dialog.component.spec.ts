import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { ExpenseFormDialogComponent } from './expense-form-dialog.component';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { CardsStateService } from '../../../cards/services/cards-state.service';
import { ExpenseResponse } from '../../models/expense.model';
import { PaymentMethod } from '../../../../shared/models/enums';

describe('ExpenseFormDialogComponent', () => {
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };
  let categoriesStateMock: {
    categories: ReturnType<typeof signal<any[]>>;
    loadCategories: ReturnType<typeof vi.fn>;
  };
  let accountsStateMock: {
    accounts: ReturnType<typeof signal<any[]>>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };
  let cardsStateMock: {
    cards: ReturnType<typeof signal<any[]>>;
    loadCards: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    dialogRefMock = { close: vi.fn() };
    categoriesStateMock = {
      categories: signal([
        { id: 'cat-1', name: 'Alimentação', color: '#ff0000', icon: 'restaurant', isDefault: true },
      ]),
      loadCategories: vi.fn(),
    };
    accountsStateMock = {
      accounts: signal([{ id: 'acc-1', name: 'Nubank Conta', balance: 1000, type: 0 }]),
      loadAccounts: vi.fn(),
    };
    cardsStateMock = {
      cards: signal([{ id: 'card-1', name: 'Nubank Ultravioleta', userId: 'u-1' }]),
      loadCards: vi.fn(),
    };
  });

  const createComponent = (data?: { expense?: ExpenseResponse }) => {
    TestBed.configureTestingModule({
      imports: [ExpenseFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data ?? {} },
        { provide: CategoriesStateService, useValue: categoriesStateMock },
        { provide: AccountsStateService, useValue: accountsStateMock },
        { provide: CardsStateService, useValue: cardsStateMock },
      ],
    });

    const fixture = TestBed.createComponent(ExpenseFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  };

  it('should initialize form for creating single expense', () => {
    const { component } = createComponent();
    expect(component.isEdit).toBe(false);
    expect(component.isInstallment.value).toBe(false);
    expect(component.form.valid).toBe(false);
  });

  it('should require creditCardId when paymentMethod is CreditCard', () => {
    const { component } = createComponent();
    component.form.controls.paymentMethod.setValue(PaymentMethod.CreditCard);
    component.onPaymentMethodChange();

    expect(component.form.controls.creditCardId.hasError('required')).toBe(true);

    component.form.controls.creditCardId.setValue('card-1');
    expect(component.form.controls.creditCardId.hasError('required')).toBe(false);
  });

  it('should submit single expense when valid', () => {
    const { component } = createComponent();
    component.form.patchValue({
      description: 'Restaurante',
      amount: 120,
      date: '2026-10-06',
      categoryId: 'cat-1',
      paymentMethod: PaymentMethod.Pix,
      accountId: 'acc-1',
    });

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      type: 'single',
      data: expect.objectContaining({
        description: 'Restaurante',
        amount: 120,
        categoryId: 'cat-1',
        paymentMethod: PaymentMethod.Pix,
      }),
    });
  });

  it('should submit installment expense when isInstallment is true', () => {
    const { component } = createComponent();
    component.isInstallment.setValue(true);
    component.form.patchValue({
      description: 'Notebook',
      amount: 2400,
      totalInstallments: 12,
      date: '2026-10-10',
      categoryId: 'cat-1',
      paymentMethod: PaymentMethod.CreditCard,
      creditCardId: 'card-1',
    });

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      type: 'installment',
      data: expect.objectContaining({
        description: 'Notebook',
        totalAmount: 2400,
        totalInstallments: 12,
        categoryId: 'cat-1',
        creditCardId: 'card-1',
      }),
    });
  });

  it('should initialize form for edit mode', () => {
    const existingExpense: ExpenseResponse = {
      id: 'e-1',
      description: 'Farmácia',
      amount: 75.5,
      date: '2026-10-06T12:00:00Z',
      paymentMethod: PaymentMethod.Cash,
      categoryId: 'cat-1',
      categoryName: 'Alimentação',
      isPaid: false,
      isInstallment: false,
      isSubscription: false,
      createdAt: '2026-10-06T12:00:00Z',
    };

    const { component } = createComponent({ expense: existingExpense });
    expect(component.isEdit).toBe(true);
    expect(component.form.controls.description.value).toBe('Farmácia');
    expect(component.form.controls.amount.value).toBe(75.5);
    expect(component.form.valid).toBe(true);
  });
});
