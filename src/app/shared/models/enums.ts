export enum AccountType {
  Checking = 0,
  Saving = 1,
  CreditCard = 2
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.Checking]: 'Conta Corrente',
  [AccountType.Saving]: 'Poupança',
  [AccountType.CreditCard]: 'Cartão de Crédito'
};

export enum PaymentMethod {
  Cash = 0,
  Debit = 1,
  CreditCard = 2,
  Pix = 3,
  Transfer = 4
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Dinheiro',
  [PaymentMethod.Debit]: 'Débito',
  [PaymentMethod.CreditCard]: 'Cartão de Crédito',
  [PaymentMethod.Pix]: 'Pix',
  [PaymentMethod.Transfer]: 'Transferência'
};

export enum Frequency {
  Weekly = 0,
  Biweekly = 1,
  Monthly = 2,
  Bimonthly = 3,
  Quarterly = 4,
  Semiannual = 5,
  Yearly = 6
}

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  [Frequency.Weekly]: 'Semanal',
  [Frequency.Biweekly]: 'Quinzenal',
  [Frequency.Monthly]: 'Mensal',
  [Frequency.Bimonthly]: 'Bimestral',
  [Frequency.Quarterly]: 'Trimestral',
  [Frequency.Semiannual]: 'Semestral',
  [Frequency.Yearly]: 'Anual'
};

export enum TransactionStatus {
  Pending = 0,
  Paid = 1,
  Cancelled = 2,
  Overdue = 3
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'Pendente',
  [TransactionStatus.Paid]: 'Pago',
  [TransactionStatus.Cancelled]: 'Cancelado',
  [TransactionStatus.Overdue]: 'Vencido'
};
