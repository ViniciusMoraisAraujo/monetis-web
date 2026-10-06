import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { SubscriptionFormDialogComponent } from './subscription-form-dialog.component';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { SubscriptionResponse } from '../../models/subscription.model';
import { Frequency } from '../../../../shared/models/enums';

describe('SubscriptionFormDialogComponent', () => {
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };
  let categoriesStateMock: { categories: ReturnType<typeof signal<any[]>>; loadCategories: ReturnType<typeof vi.fn> };
  let accountsStateMock: { accounts: ReturnType<typeof signal<any[]>>; loadAccounts: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dialogRefMock = { close: vi.fn() };
    categoriesStateMock = {
      categories: signal([
        { id: 'cat-1', name: 'Serviços', isDefault: true },
      ]),
      loadCategories: vi.fn(),
    };
    accountsStateMock = {
      accounts: signal([
        { id: 'acc-1', name: 'Nubank', balance: 1000 },
      ]),
      loadAccounts: vi.fn(),
    };
  });

  const createComponent = (data?: { subscription?: SubscriptionResponse }) => {
    TestBed.configureTestingModule({
      imports: [SubscriptionFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data ?? {} },
        { provide: CategoriesStateService, useValue: categoriesStateMock },
        { provide: AccountsStateService, useValue: accountsStateMock },
      ],
    });

    const fixture = TestBed.createComponent(SubscriptionFormDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  };

  it('should initialize form for creating subscription', () => {
    const { component } = createComponent();
    expect(component.isEdit).toBe(false);
    expect(component.form.valid).toBe(false);
  });

  it('should initialize form for editing subscription with existing data', () => {
    const existing: SubscriptionResponse = {
      id: 'sub-1',
      description: 'Netflix',
      amount: 55.9,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-01T00:00:00Z',
      isActive: true,
    };

    const { component } = createComponent({ subscription: existing });
    expect(component.isEdit).toBe(true);
    expect(component.form.controls.description.value).toBe('Netflix');
    expect(component.form.controls.amount.value).toBe(55.9);
    expect(component.form.valid).toBe(true);
  });

  it('should submit form when valid', () => {
    const { component } = createComponent();
    component.form.patchValue({
      description: 'Spotify Premium',
      amount: 21.9,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-05',
      accountId: 'acc-1',
      categoryId: 'cat-1',
      paymentMethod: 2,
    });

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Spotify Premium',
        amount: 21.9,
        frequency: Frequency.Monthly,
      }),
    );
  });

  it('should not submit form when invalid', () => {
    const { component } = createComponent();
    component.onSubmit();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
