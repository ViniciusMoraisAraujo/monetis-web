import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CardsStateService } from './cards-state.service';
import { CardsApiService } from './cards-api.service';
import { CardResponse } from '../models/card.model';

describe('CardsStateService', () => {
  let service: CardsStateService;
  let apiServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockCards: CardResponse[] = [
    { id: '1', name: 'Nubank Platinum', userId: 'user-1' },
    { id: '2', name: 'Inter Black', userId: 'user-1' },
  ];

  beforeEach(() => {
    apiServiceMock = {
      getAll: vi.fn().mockReturnValue(of(mockCards)),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [CardsStateService, { provide: CardsApiService, useValue: apiServiceMock }],
    });

    service = TestBed.inject(CardsStateService);
  });

  it('should initialize with empty cards and load them', () => {
    expect(service.cards()).toEqual([]);
    service.loadCards();
    expect(service.cards()).toEqual(mockCards);
    expect(service.loading()).toBe(false);
  });

  it('should add a card to signal list on createCard', () => {
    const newCard: CardResponse = { id: '3', name: 'C6 Carbon', userId: 'user-1' };
    apiServiceMock.create.mockReturnValue(of(newCard));

    service.loadCards();
    service.createCard({ name: 'C6 Carbon' }).subscribe((created) => {
      expect(created).toEqual(newCard);
    });

    expect(service.cards().length).toBe(3);
    expect(service.cards()).toContainEqual(newCard);
  });

  it('should update a card in signal list on updateCard', () => {
    apiServiceMock.update.mockReturnValue(of(undefined));

    service.loadCards();
    service.updateCard('1', { name: 'Nubank Ultravioleta' }).subscribe();

    const updated = service.cards().find((c) => c.id === '1');
    expect(updated?.name).toBe('Nubank Ultravioleta');
  });

  it('should remove a card from signal list on deleteCard', () => {
    apiServiceMock.delete.mockReturnValue(of(undefined));

    service.loadCards();
    service.deleteCard('1').subscribe();

    expect(service.cards().find((c) => c.id === '1')).toBeUndefined();
    expect(service.cards().length).toBe(1);
  });

  it('should set error signal when loadCards fails', () => {
    apiServiceMock.getAll.mockReturnValue(throwError(() => ({ message: 'Failed to load' })));

    service.loadCards();

    expect(service.error()).toBe('Failed to load');
    expect(service.loading()).toBe(false);
  });
});
