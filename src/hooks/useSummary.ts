import { TransactionsContext } from "../contexts/TransactionsContext";
import { useContextSelector } from 'use-context-selector';
import { useMemo } from 'react'

export function useSummary() {
    const transactions = useContextSelector(TransactionsContext, (context) => {
        return context.transactions
    })

    console.log(transactions)

    // O método reduce percorre um array e o reduz a uma nova estrutura de dados. O acc é o resumo (objeto abaixo) e o valor inicial do reduce, onde podemos alterá-lo entre iterações para poder acumular valores, e a transaction é cada transação
    const summary = useMemo(() => {
        return transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === 'income') {
                    acc.income += transaction.price;
                    acc.total += transaction.price
                } else {
                    acc.outcome += transaction.price;
                    acc.total -= transaction.price
                }
    
                return acc
        },
        {
            income: 0, 
            outcome: 0, 
            total: 0 
          }
        )
    }, [transactions])

    return summary
}

/* React hook É o valor inicial do reduce, onde podemos alterá-lo entre iterações para poder acumular valores. */

 /* o useMemo trabalha com variáveis que não precisam ser recriadas na memória a cada renderização. Nesse caso em especial, a variável summary só vai atualizar se o transactions mudar */