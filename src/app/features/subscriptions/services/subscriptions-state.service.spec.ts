import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SubscriptionsStateService } from './subscriptions-state.service';
import { SubscriptionsApiService } from './subscriptions-api.service';
import { SubscriptionResponse } from '../models/subscription.model';
import { Frequency } from '../../../shared/models/enums';

describe('SubscriptionsStateService', () => {
  let service: SubscriptionsStateService;
  let apiServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockSubscriptions: SubscriptionResponse[] = [
    {
      id: 'sub-1',
      description: 'Netflix',
      amount: 50,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-01T00:00:00Z',
      isActive: true,
    },
    {
      id: 'sub-2',
      description: 'Academia',
      amount: 100,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-10T00:00:00Z',
      isActive: false,
    },
  ];

  beforeEach(() => {
    apiServiceMock = {
      getAll: vi.fn().mockReturnValue(of(mockSubscriptions)),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SubscriptionsStateService,
        { provide: SubscriptionsApiService, useValue: apiServiceMock },
      ],
    });

    service = TestBed.inject(SubscriptionsStateService);
  });

  it('should initialize and load subscriptions with computed metrics', () => {
    expect(service.subscriptions()).toEqual([]);
    service.loadSubscriptions();

    expect(service.subscriptions()).toEqual(mockSubscriptions);
    expect(service.activeSubscriptionsCount()).toBe(1);
    expect(service.totalActiveAmount()).toBe(50);
    expect(service.loading()).toBe(false);
  });

  it('should add created subscription to signal list', () => {
    const created: SubscriptionResponse = {
      id: 'sub-3',
      description: 'Spotify',
      amount: 25,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-15T00:00:00Z',
      isActive: true,
    };
    apiServiceMock.create.mockReturnValue(of(created));

    service.loadSubscriptions();
    service.createSubscription({
      accountId: 'acc-1',
      categoryId: 'cat-1',
      amount: 25,
      description: 'Spotify',
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-15T00:00:00Z',
      paymentMethod: 2,
    }).subscribe();

    expect(service.subscriptions().length).toBe(3);
    expect(service.activeSubscriptionsCount()).toBe(2);
    expect(service.totalActiveAmount()).toBe(75);
  });

  it('should update subscription in signal list', () => {
    apiServiceMock.update.mockReturnValue(of(undefined));

    service.loadSubscriptions();
    service.updateSubscription('sub-1', {
      description: 'Netflix 4K',
      amount: 60,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-01T00:00:00Z',
      isActive: true,
    }).subscribe();

    const updated = service.subscriptions().find((s) => s.id === 'sub-1');
    expect(updated?.description).toBe('Netflix 4K');
    expect(updated?.amount).toBe(60);
  });

  it('should remove subscription from signal list on delete', () => {
    apiServiceMock.delete.mockReturnValue(of(undefined));

    service.loadSubscriptions();
    service.deleteSubscription('sub-1').subscribe();

    expect(service.subscriptions().length).toBe(1);
    expect(service.totalActiveAmount()).toBe(0);
  });

  it('should handle error when loadSubscriptions fails', () => {
    apiServiceMock.getAll.mockReturnValue(throwError(() => ({ message: 'Erro ao carregar assinaturas' })));

    service.loadSubscriptions();

    expect(service.error()).toBe('Erro ao carregar assinaturas');
    expect(service.loading()).toBe(false);
  });
});
