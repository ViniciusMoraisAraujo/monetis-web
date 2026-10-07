import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DashboardHomeComponent } from './dashboard-home.component';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { ExpensesStateService } from '../../../expenses/services/expenses-state.service';
import { IncomesStateService } from '../../../incomes/services/incomes-state.service';
import { CardsStateService } from '../../../cards/services/cards-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PrivacyService } from '../../../../core/services/privacy.service';
import '../../../../core/i18n';

describe('DashboardHomeComponent', () => {
  let accountsStateMock: {
    totalBalance: ReturnType<typeof signal<number>>;
    accounts: ReturnType<typeof signal<any[]>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    errorMessage: ReturnType<typeof signal<string | null>>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };

  let expensesStateMock: {
    totalAmount: ReturnType<typeof signal<number>>;
    paidAmount: ReturnType<typeof signal<number>>;
    unpaidAmount: ReturnType<typeof signal<number>>;
    expenses: ReturnType<typeof signal<any[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadExpenses: ReturnType<typeof vi.fn>;
  };

  let incomesStateMock: {
    totalAmount: ReturnType<typeof signal<number>>;
    receivedAmount: ReturnType<typeof signal<number>>;
    pendingAmount: ReturnType<typeof signal<number>>;
    incomes: ReturnType<typeof signal<any[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadIncomes: ReturnType<typeof vi.fn>;
  };

  let cardsStateMock: {
    cards: ReturnType<typeof signal<any[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadCards: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    currentUser: ReturnType<typeof signal<{ id: string; email: string } | null>>;
  };

  let privacyServiceMock: {
    isValuesVisible: ReturnType<typeof signal<boolean>>;
    toggleValuesVisibility: ReturnType<typeof vi.fn>;
    ariaLabel: ReturnType<typeof signal<string>>;
    ariaPressed: ReturnType<typeof signal<boolean>>;
    maskValue: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    accountsStateMock = {
      totalBalance: signal(5000.5),
      accounts: signal([{ id: '1', name: 'Nubank', balance: 5000.5 }]),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null),
      loadAccounts: vi.fn(),
    };

    expensesStateMock = {
      totalAmount: signal(1200.0),
      paidAmount: signal(800.0),
      unpaidAmount: signal(400.0),
      loading: signal(false),
      error: signal<string | null>(null),
      expenses: signal([
        {
          id: 'e1',
          description: 'Mercado',
          amount: 350,
          date: '2026-10-06T12:00:00Z',
          isPaid: true,
          categoryName: 'Alimentação',
          creditCardId: 'c1',
        },
      ]),
      loadExpenses: vi.fn(),
    };

    incomesStateMock = {
      totalAmount: signal(6000.0),
      receivedAmount: signal(6000.0),
      pendingAmount: signal(0),
      loading: signal(false),
      error: signal<string | null>(null),
      incomes: signal([
        {
          id: 'i1',
          description: 'Salário',
          amount: 6000,
          receivedAt: '2026-10-05T00:00:00Z',
          date: '2026-10-05T00:00:00Z',
          isReceived: true,
          categoryName: 'Trabalho',
        },
      ]),
      loadIncomes: vi.fn(),
    };

    cardsStateMock = {
      cards: signal([{ id: 'c1', name: 'Cartão Nubank Ultravioleta' }]),
      loading: signal(false),
      error: signal<string | null>(null),
      loadCards: vi.fn(),
    };

    authServiceMock = {
      currentUser: signal({ id: 'u1', email: 'vinicius@exemplo.com' }),
    };

    privacyServiceMock = {
      isValuesVisible: signal(true),
      toggleValuesVisibility: vi.fn(),
      ariaLabel: signal('Ocultar valores'),
      ariaPressed: signal(false),
      maskValue: vi.fn((val: string) => val),
    };

    TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [
        provideRouter([]),
        { provide: AccountsStateService, useValue: accountsStateMock },
        { provide: ExpensesStateService, useValue: expensesStateMock },
        { provide: IncomesStateService, useValue: incomesStateMock },
        { provide: CardsStateService, useValue: cardsStateMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: PrivacyService, useValue: privacyServiceMock },
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
    expect(cardsStateMock.loadCards).toHaveBeenCalled();
  });

  it('should calculate net balance correctly (incomes - expenses)', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.netBalance()).toBe(4800.0);
  });

  it('should personalize greeting with user name', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.greeting()).toContain('Vinicius');
  });

  it('should calculate credit card metrics and progress percentage', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.creditCardTotal()).toBe(350);
    expect(component.creditLimitUsedPercent()).toBeGreaterThan(0);
    expect(component.availableLimit()).toBeGreaterThan(0);
  });

  it('should calculate monthly flow ratio between incomes and expenses', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.flowIncomePercent()).toBeGreaterThan(component.flowExpensePercent());
  });

  it('should toggle balance visibility via privacy service', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.toggleBalanceVisibility();
    expect(privacyServiceMock.toggleValuesVisibility).toHaveBeenCalled();
  });

  it('should aggregate recent transactions sorted by date', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const transactions = component.recentTransactions();
    expect(transactions.length).toBe(2);
    expect(transactions[0].description).toBe('Mercado');
    expect(transactions[1].description).toBe('Salário');
  });

  // Testes dos 4 estados normativos (DESIGN.md Seção 6)
  it('should render loading state with skeletons when loading is true', () => {
    accountsStateMock.isLoading.set(true);
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    fixture.detectChanges();

    const skeletons = fixture.debugElement.queryAll(By.css('.nu-skeleton'));
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render error state with retry button when error occurs', () => {
    accountsStateMock.errorMessage.set('Falha na conexão com o servidor');
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.dashboard-error-state'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Falha na conexão com o servidor');

    const retryBtn = fixture.debugElement.query(By.css('.retry-btn'));
    expect(retryBtn).toBeTruthy();
    retryBtn.nativeElement.click();

    expect(accountsStateMock.loadAccounts).toHaveBeenCalled();
  });

  it('should render empty state with CTAs when no transactions exist', () => {
    expensesStateMock.expenses.set([]);
    incomesStateMock.incomes.set([]);
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    fixture.detectChanges();

    const emptyTitle = fixture.debugElement.query(By.css('.nu-empty-title'));
    expect(emptyTitle).toBeTruthy();
    expect(emptyTitle.nativeElement.textContent).toContain('Nenhuma transação registrada');

    const ctaBtns = fixture.debugElement.queryAll(By.css('.empty-cta-group a'));
    expect(ctaBtns.length).toBe(2);
  });

  it('should render content state with recent transactions when available', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    fixture.detectChanges();

    const feedItems = fixture.debugElement.queryAll(By.css('.feed-item'));
    expect(feedItems.length).toBe(2);
  });
});
