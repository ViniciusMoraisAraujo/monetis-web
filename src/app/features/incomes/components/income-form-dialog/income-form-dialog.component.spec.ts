import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { IncomeFormDialogComponent } from './income-form-dialog.component';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { IncomeResponse } from '../../models/income.model';

describe('IncomeFormDialogComponent', () => {
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };
  let categoriesStateMock: {
    categories: ReturnType<typeof signal<any[]>>;
    loadCategories: ReturnType<typeof vi.fn>;
  };
  let accountsStateMock: {
    accounts: ReturnType<typeof signal<any[]>>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    dialogRefMock = { close: vi.fn() };
    categoriesStateMock = {
      categories: signal([{ id: 'cat-inc', name: 'Salário', isDefault: true }]),
      loadCategories: vi.fn(),
    };
    accountsStateMock = {
      accounts: signal([{ id: 'acc-1', name: 'Banco Itaú', balance: 3500 }]),
      loadAccounts: vi.fn(),
    };
  });

  const createComponent = (data?: { income?: IncomeResponse }) => {
    TestBed.configureTestingModule({
      imports: [IncomeFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data ?? {} },
        { provide: CategoriesStateService, useValue: categoriesStateMock },
        { provide: AccountsStateService, useValue: accountsStateMock },
      ],
    });

    const fixture = TestBed.createComponent(IncomeFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  };

  it('should initialize form for creating income', () => {
    const { component } = createComponent();
    expect(component.isEdit).toBe(false);
    expect(component.form.valid).toBe(false);
  });

  it('should initialize form for editing income with existing data', () => {
    const existing: IncomeResponse = {
      id: 'inc-1',
      description: 'Salário CLT',
      amount: 4500,
      receivedAt: '2026-10-05T00:00:00Z',
      date: '2026-10-05T00:00:00Z',
      categoryId: 'cat-inc',
      categoryName: 'Salário',
      accountId: 'acc-1',
      accountName: 'Banco Itaú',
      isReceived: true,
      isSubscription: false,
      createdAt: '2026-10-01T00:00:00Z',
    };

    const { component } = createComponent({ income: existing });
    expect(component.isEdit).toBe(true);
    expect(component.form.controls.description.value).toBe('Salário CLT');
    expect(component.form.controls.amount.value).toBe(4500);
    expect(component.form.controls.receivedAt.value).toBe('2026-10-05');
    expect(component.form.valid).toBe(true);
  });

  it('should submit form when valid', () => {
    const { component } = createComponent();
    component.form.patchValue({
      description: 'Rendimento CDI',
      amount: 150.25,
      receivedAt: '2026-10-06',
      categoryId: 'cat-inc',
      accountId: 'acc-1',
    });

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Rendimento CDI',
        amount: 150.25,
        receivedAt: expect.stringContaining('2026-10-06'),
        categoryId: 'cat-inc',
        accountId: 'acc-1',
      }),
    );
  });

  it('should not submit form when invalid', () => {
    const { component } = createComponent();
    component.onSubmit();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
