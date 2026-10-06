import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { DashboardHomeComponent } from './dashboard-home.component';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { ExpensesStateService } from '../../../expenses/services/expenses-state.service';
import { IncomesStateService } from '../../../incomes/services/incomes-state.service';
import '../../../../core/i18n';

describe('DashboardHomeComponent', () => {
  let accountsStateMock: {
    totalBalance: ReturnType<typeof signal<number>>;
    accounts: ReturnType<typeof signal<any[]>>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };

  let expensesStateMock: {
    totalAmount: ReturnType<typeof signal<number>>;
    paidAmount: ReturnType<typeof signal<number>>;
    unpaidAmount: ReturnType<typeof signal<number>>;
    expenses: ReturnType<typeof signal<any[]>>;
    loadExpenses: ReturnType<typeof vi.fn>;
  };

  let incomesStateMock: {
    totalAmount: ReturnType<typeof signal<number>>;
    receivedAmount: ReturnType<typeof signal<number>>;
    pendingAmount: ReturnType<typeof signal<number>>;
    incomes: ReturnType<typeof signal<any[]>>;
    loadIncomes: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    accountsStateMock = {
      totalBalance: signal(5000.5),
      accounts: signal([{ id: '1', name: 'Nubank', balance: 5000.5 }]),
      loadAccounts: vi.fn(),
    };

    expensesStateMock = {
      totalAmount: signal(1200.0),
      paidAmount: signal(800.0),
      unpaidAmount: signal(400.0),
      expenses: signal([
        { id: 'e1', description: 'Mercado', amount: 350, date: '2026-10-06T12:00:00Z', isPaid: true, categoryName: 'Alimentação' },
      ]),
      loadExpenses: vi.fn(),
    };

    incomesStateMock = {
      totalAmount: signal(6000.0),
      receivedAmount: signal(6000.0),
      pendingAmount: signal(0),
      incomes: signal([
        { id: 'i1', description: 'Salário', amount: 6000, date: '2026-10-05T00:00:00Z', isReceived: true, categoryName: 'Trabalho' },
      ]),
      loadIncomes: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [
        provideRouter([]),
        { provide: AccountsStateService, useValue: accountsStateMock },
        { provide: ExpensesStateService, useValue: expensesStateMock },
        { provide: IncomesStateService, useValue: incomesStateMock },
      ],
    });
  });

  it('should initialize and load all financial data on init', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(accountsStateMock.loadAccounts).toHaveBeenCalled();
    expect(expensesStateMock.loadExpenses).toHaveBeenCalled();
    expect(incomesStateMock.loadIncomes).toHaveBeenCalled();
  });

  it('should calculate net balance correctly (incomes - expenses)', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.netBalance()).toBe(4800.0);
  });
});
