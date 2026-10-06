import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CardListComponent } from './card-list.component';
import { CardsStateService } from '../../services/cards-state.service';
import { CardResponse } from '../../models/card.model';
import { signal } from '@angular/core';

describe('CardListComponent', () => {
  let cardsStateMock: {
    cards: ReturnType<typeof signal<CardResponse[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadCards: ReturnType<typeof vi.fn>;
    createCard: ReturnType<typeof vi.fn>;
    updateCard: ReturnType<typeof vi.fn>;
    deleteCard: ReturnType<typeof vi.fn>;
  };

  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const mockCards: CardResponse[] = [
    { id: '1', name: 'Nubank Ultravioleta', userId: 'user-1' },
    { id: '2', name: 'C6 Carbon', userId: 'user-1' },
  ];

  beforeEach(() => {
    cardsStateMock = {
      cards: signal(mockCards),
      loading: signal(false),
      error: signal(null),
      loadCards: vi.fn(),
      createCard: vi.fn().mockReturnValue(of({ id: '3', name: 'Inter Black', userId: 'user-1' })),
      updateCard: vi.fn().mockReturnValue(of(undefined)),
      deleteCard: vi.fn().mockReturnValue(of(undefined)),
    };

    dialogMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CardListComponent],
      providers: [
        { provide: CardsStateService, useValue: cardsStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });
  });

  it('should create card list component and load cards on init', () => {
    const fixture = TestBed.createComponent(CardListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(cardsStateMock.loadCards).toHaveBeenCalled();
  });

  it('should open create dialog and call createCard when confirmed', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of({ name: 'Inter Black' }),
    });

    const fixture = TestBed.createComponent(CardListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openCreateDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(cardsStateMock.createCard).toHaveBeenCalledWith({ name: 'Inter Black' });
  });

  it('should open edit dialog and call updateCard when confirmed', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of({ name: 'Nubank Black' }),
    });

    const fixture = TestBed.createComponent(CardListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openEditDialog(mockCards[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(cardsStateMock.updateCard).toHaveBeenCalledWith('1', { name: 'Nubank Black' });
  });

  it('should call deleteCard when delete confirmed', () => {
    const fixture = TestBed.createComponent(CardListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete(mockCards[0]);

    expect(cardsStateMock.deleteCard).toHaveBeenCalledWith('1');
  });

  it('should not call deleteCard when delete canceled', () => {
    const fixture = TestBed.createComponent(CardListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.onDelete(mockCards[0]);

    expect(cardsStateMock.deleteCard).not.toHaveBeenCalled();
  });
});
