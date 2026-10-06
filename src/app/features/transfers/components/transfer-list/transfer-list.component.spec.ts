import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { TransferListComponent } from './transfer-list.component';
import { TransfersStateService } from '../../services/transfers-state.service';
import { AccountsStateService } from '../../../accounts/services/accounts-state.service';
import { TransferResponse } from '../../models/transfer.model';
import '../../../../core/i18n';

describe('TransferListComponent', () => {
  let transfersStateMock: {
    transfers: ReturnType<typeof signal<TransferResponse[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    totalTransferred: ReturnType<typeof signal<number>>;
    loadTransfers: ReturnType<typeof vi.fn>;
    createTransfer: ReturnType<typeof vi.fn>;
    deleteTransfer: ReturnType<typeof vi.fn>;
  };

  let accountsStateMock: {
    accounts: ReturnType<typeof signal<any[]>>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };

  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const mockTransfers: TransferResponse[] = [
    {
      id: 't-1',
      fromAccountId: 'acc-1',
      fromAccountName: 'Nubank',
      toAccountId: 'acc-2',
      toAccountName: 'Inter',
      amount: 1500,
      date: '2026-10-06T12:00:00Z',
      description: 'Aporte de Investimento',
      createdAt: '2026-10-06T12:00:00Z',
    },
  ];

  beforeEach(() => {
    transfersStateMock = {
      transfers: signal(mockTransfers),
      loading: signal(false),
      error: signal(null),
      totalTransferred: signal(1500),
      loadTransfers: vi.fn(),
      createTransfer: vi.fn().mockReturnValue(of({} as TransferResponse)),
      deleteTransfer: vi.fn().mockReturnValue(of(undefined)),
    };

    accountsStateMock = {
      accounts: signal([]),
      loadAccounts: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TransferListComponent],
      providers: [
        { provide: TransfersStateService, useValue: transfersStateMock },
        { provide: AccountsStateService, useValue: accountsStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });
  });

  it('should initialize and load transfers and accounts', () => {
    const fixture = TestBed.createComponent(TransferListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(transfersStateMock.loadTransfers).toHaveBeenCalled();
    expect(accountsStateMock.loadAccounts).toHaveBeenCalled();
  });

  it('should open create dialog and call createTransfer when confirmed', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () =>
        of({
          fromAccountId: 'acc-1',
          toAccountId: 'acc-2',
          amount: 500,
          date: '2026-10-06T12:00:00Z',
        }),
    });

    const fixture = TestBed.createComponent(TransferListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openCreateDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(transfersStateMock.createTransfer).toHaveBeenCalled();
  });

  it('should call deleteTransfer on confirmation', () => {
    const fixture = TestBed.createComponent(TransferListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete(mockTransfers[0]);

    expect(transfersStateMock.deleteTransfer).toHaveBeenCalledWith('t-1');
  });
});
