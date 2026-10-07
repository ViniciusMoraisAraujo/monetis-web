import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { SubscriptionListComponent } from './subscription-list.component';
import { SubscriptionsStateService } from '../../services/subscriptions-state.service';
import { SubscriptionResponse } from '../../models/subscription.model';
import { Frequency } from '../../../../shared/models/enums';
import '../../../../core/i18n';

describe('SubscriptionListComponent', () => {
  let subscriptionsStateMock: {
    subscriptions: ReturnType<typeof signal<SubscriptionResponse[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    activeSubscriptionsCount: ReturnType<typeof signal<number>>;
    totalActiveAmount: ReturnType<typeof signal<number>>;
    loadSubscriptions: ReturnType<typeof vi.fn>;
    createSubscription: ReturnType<typeof vi.fn>;
    updateSubscription: ReturnType<typeof vi.fn>;
    deleteSubscription: ReturnType<typeof vi.fn>;
  };

  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const mockSubscriptions: SubscriptionResponse[] = [
    {
      id: 'sub-1',
      description: 'Netflix Premium',
      amount: 55.9,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-01T00:00:00Z',
      isActive: true,
    },
    {
      id: 'sub-2',
      description: 'Academia SmartFit',
      amount: 119.9,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-10T00:00:00Z',
      isActive: false,
    },
  ];

  beforeEach(() => {
    subscriptionsStateMock = {
      subscriptions: signal(mockSubscriptions),
      loading: signal(false),
      error: signal(null),
      activeSubscriptionsCount: signal(1),
      totalActiveAmount: signal(55.9),
      loadSubscriptions: vi.fn(),
      createSubscription: vi.fn().mockReturnValue(of({} as SubscriptionResponse)),
      updateSubscription: vi.fn().mockReturnValue(of(undefined)),
      deleteSubscription: vi.fn().mockReturnValue(of(undefined)),
    };

    dialogMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [SubscriptionListComponent],
      providers: [
        { provide: SubscriptionsStateService, useValue: subscriptionsStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });
  });

  it('should initialize and load subscriptions on init', () => {
    const fixture = TestBed.createComponent(SubscriptionListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(subscriptionsStateMock.loadSubscriptions).toHaveBeenCalled();
  });

  it('should open create dialog and call createSubscription when confirmed', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () =>
        of({
          description: 'Spotify Family',
          amount: 34.9,
          frequency: Frequency.Monthly,
          nextDueDate: '2026-11-05T00:00:00Z',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          paymentMethod: 2,
        }),
    });

    const fixture = TestBed.createComponent(SubscriptionListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openCreateDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(subscriptionsStateMock.createSubscription).toHaveBeenCalled();
  });

  it('should open edit dialog and call updateSubscription when confirmed', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () =>
        of({
          description: 'Netflix 4K',
          amount: 59.9,
          frequency: Frequency.Monthly,
          nextDueDate: '2026-11-01T00:00:00Z',
          isActive: true,
        }),
    });

    const fixture = TestBed.createComponent(SubscriptionListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openEditDialog(mockSubscriptions[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(subscriptionsStateMock.updateSubscription).toHaveBeenCalledWith(
      'sub-1',
      expect.anything(),
    );
  });

  it('should call deleteSubscription on confirmation', () => {
    const fixture = TestBed.createComponent(SubscriptionListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete(mockSubscriptions[0]);

    expect(subscriptionsStateMock.deleteSubscription).toHaveBeenCalledWith('sub-1');
  });
});
