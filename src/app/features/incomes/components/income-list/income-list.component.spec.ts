import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { IncomeListComponent } from './income-list.component';
import { IncomesStateService } from '../../services/incomes-state.service';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { IncomeResponse } from '../../models/income.model';
import '../../../../core/i18n';

describe('IncomeListComponent', () => {
  let incomesStateMock: {
    incomes: ReturnType<typeof signal<IncomeResponse[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    totalAmount: ReturnType<typeof signal<number>>;
    receivedAmount: ReturnType<typeof signal<number>>;
    pendingAmount: ReturnType<typeof signal<number>>;
    loadIncomes: ReturnType<typeof vi.fn>;
    createIncome: ReturnType<typeof vi.fn>;
    updateIncome: ReturnType<typeof vi.fn>;
    receiveIncome: ReturnType<typeof vi.fn>;
    deleteIncome: ReturnType<typeof vi.fn>;
  };

  let categoriesStateMock: {
    categories: ReturnType<typeof signal<any[]>>;
    loadCategories: ReturnType<typeof vi.fn>;
  };

  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const mockIncomes: IncomeResponse[] = [
    {
      id: 'i-1',
      description: 'Salário Mensal',
      amount: 6000.0,
      date: '2026-10-05T00:00:00Z',
      categoryId: 'cat-1',
      categoryName: 'Salário',
      accountId: 'acc-1',
      accountName: 'Nubank',
      isReceived: true,
      receivedAt: '2026-10-05T10:00:00Z',
      isSubscription: false,
      createdAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'i-2',
      description: 'Consultoria Web',
      amount: 2500.0,
      date: '2026-10-25T00:00:00Z',
      categoryId: 'cat-2',
      categoryName: 'Freelance',
      accountId: 'acc-1',
      accountName: 'Nubank',
      isReceived: false,
      isSubscription: false,
      createdAt: '2026-10-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    incomesStateMock = {
      incomes: signal(mockIncomes),
      loading: signal(false),
      error: signal(null),
      totalAmount: signal(8500.0),
      receivedAmount: signal(6000.0),
      pendingAmount: signal(2500.0),
      loadIncomes: vi.fn(),
      createIncome: vi.fn().mockReturnValue(of({} as IncomeResponse)),
      updateIncome: vi.fn().mockReturnValue(of(undefined)),
      receiveIncome: vi.fn().mockReturnValue(of(undefined)),
      deleteIncome: vi.fn().mockReturnValue(of(undefined)),
    };

    categoriesStateMock = {
      categories: signal([]),
      loadCategories: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [IncomeListComponent],
      providers: [
        { provide: IncomesStateService, useValue: incomesStateMock },
        { provide: CategoriesStateService, useValue: categoriesStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });
  });

  it('should initialize and load incomes and categories', () => {
    const fixture = TestBed.createComponent(IncomeListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(incomesStateMock.loadIncomes).toHaveBeenCalled();
    expect(categoriesStateMock.loadCategories).toHaveBeenCalled();
  });

  it('should open create dialog and call createIncome on confirm', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () =>
        of({
          description: 'Projeto Novo',
          amount: 1500,
          date: '2026-10-15T00:00:00Z',
          categoryId: 'cat-2',
          accountId: 'acc-1',
        }),
    });

    const fixture = TestBed.createComponent(IncomeListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openCreateDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(incomesStateMock.createIncome).toHaveBeenCalled();
  });

  it('should call receiveIncome when receive action clicked', () => {
    const fixture = TestBed.createComponent(IncomeListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.onReceive(mockIncomes[1]);

    expect(incomesStateMock.receiveIncome).toHaveBeenCalledWith('i-2');
  });

  it('should call deleteIncome when delete confirmed', () => {
    const fixture = TestBed.createComponent(IncomeListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete(mockIncomes[0]);

    expect(incomesStateMock.deleteIncome).toHaveBeenCalledWith('i-1');
  });
});
