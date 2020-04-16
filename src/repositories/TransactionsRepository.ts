import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((total, { type, value }) => {
      if (type === 'income') {
        return total + value;
      }
      return total;
    }, 0);

    const outcome = this.transactions.reduce((total, { type, value }) => {
      if (type === 'outcome') {
        return total + value;
      }
      return total;
    }, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: RequestDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('Insufficient Funds for this operation');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
