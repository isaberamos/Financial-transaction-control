import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

// É interessante criar uma nova interface aqui, visto que, algum dia essa informação de transação poderá ser criada em outro lugar, portanto não ideal herdar as informações do modal para que a criação não seja acoplda/dependente do componente modal.
interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async (query?: string) => {
    // const url = new URL('http://localhost:3333/transactions')

    // if (query) {
    //     url.searchParams.append('q', query);
    // }

    // const response = await fetch(url)
    // const data = await response.json()

    const response = await api.get("/transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });

    // Atualiza o array de transactions
    setTransactions(response.data);

    console.log(response.data);
  },
  []
)

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data;
  
      const response = await api.post("/transactions", {
        // description: data.description,
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      });
  
      console.log(response.data);
  
      setTransactions((state) => [response.data, ...state]);
    },
    [],
  )

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  // Se colocar o array vazio no useEffect a função executará apenas uma vez

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

/* Poderia expor uma função no contexto para atualizar a listagem de Transactions após a criação de uma nova transação, mas o problema é que cada componente tem a sua lógica de atualização das transactions, então o ideal seria criar uma função para criar a transaction dentro do contexto */

/* o useCallback evita que uma função seja criada em memória se nenhuma informação mudar. Cuidar com o que colocar dentro do array, pois se a função precisar de uma informação de fora dela, será necessário constar no array para que esta seja atualizada */