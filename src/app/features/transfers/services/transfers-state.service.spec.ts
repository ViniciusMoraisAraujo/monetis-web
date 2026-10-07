import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TransfersStateService } from './transfers-state.service';
import { TransfersApiService } from './transfers-api.service';
import { TransferResponse } from '../models/transfer.model';

describe('TransfersStateService', () => {
  let service: TransfersStateService;
  let apiServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockTransfers: TransferResponse[] = [
    {
      id: 't-1',
      fromAccountId: 'acc-1',
      fromAccountName: 'Nubank',
      toAccountId: 'acc-2',
      toAccountName: 'Inter',
      amount: 400,
      date: '2026-10-06T12:00:00Z',
      createdAt: '2026-10-06T12:00:00Z',
    },
    {
      id: 't-2',
      fromAccountId: 'acc-2',
      fromAccountName: 'Inter',
      toAccountId: 'acc-1',
      toAccountName: 'Nubank',
      amount: 150,
      date: '2026-10-05T12:00:00Z',
      createdAt: '2026-10-05T12:00:00Z',
    },
  ];

  beforeEach(() => {
    apiServiceMock = {
      getAll: vi.fn().mockReturnValue(of(mockTransfers)),
      create: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransfersStateService,
        { provide: TransfersApiService, useValue: apiServiceMock },
      ],
    });

    service = TestBed.inject(TransfersStateService);
  });

  it('should initialize and load transfers with computed totalTransferred', () => {
    expect(service.transfers()).toEqual([]);
    service.loadTransfers();

    expect(service.transfers()).toEqual(mockTransfers);
    expect(service.totalTransferred()).toBe(550);
    expect(service.loading()).toBe(false);
  });

  it('should add created transfer to signal list', () => {
    const created: TransferResponse = {
      id: 't-3',
      fromAccountId: 'acc-1',
      fromAccountName: 'Nubank',
      toAccountId: 'acc-3',
      toAccountName: 'C6',
      amount: 300,
      date: '2026-10-07T10:00:00Z',
      createdAt: '2026-10-06T10:00:00Z',
    };
    apiServiceMock.create.mockReturnValue(of(created));

    service.loadTransfers();
    service
      .createTransfer({
        fromAccountId: 'acc-1',
        toAccountId: 'acc-3',
        amount: 300,
        date: '2026-10-07T10:00:00Z',
      })
      .subscribe();

    expect(service.transfers().length).toBe(3);
    expect(service.totalTransferred()).toBe(850);
  });

  it('should remove deleted transfer from signal list', () => {
    apiServiceMock.delete.mockReturnValue(of(undefined));

    service.loadTransfers();
    service.deleteTransfer('t-1').subscribe();

    expect(service.transfers().length).toBe(1);
    expect(service.totalTransferred()).toBe(150);
  });

  it('should handle error when loadTransfers fails', () => {
    apiServiceMock.getAll.mockReturnValue(throwError(() => ({ message: 'Erro ao carregar' })));

    service.loadTransfers();

    expect(service.error()).toBe('Erro ao carregar');
    expect(service.loading()).toBe(false);
  });
});
