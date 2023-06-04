import * as Dialog from "@radix-ui/react-dialog"
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from "./styles"
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import * as z from 'zod';
import { Controller, useForm } from "react-hook-form";
import { useContextSelector } from "use-context-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../contexts/TransactionsContext";

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']), /* enum é para quando tem opções pré estabelecidos */
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  const createTransaction = useContextSelector(TransactionsContext, 
    (context) => {
    return context.createTransaction
    // A função retorna quais informações devem ser observadas para verificar as mudanças
  },
  )
  
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionFormInputs>({
      resolver: zodResolver(newTransactionFormSchema),
      defaultValues: {
        type: 'income'
      }
  })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    const { description, price, category, type } = data

    await createTransaction({
      description,
      price,
      category,
      type,
    });
  
    reset()
  }

    return (
      /* Coloca os elementos fora das divs existentes externamente */
      <Dialog.Portal>
        <Overlay />

        <Content>
          <Dialog.Title>Nova Transação</Dialog.Title>

          <CloseButton>
            <X />
          </CloseButton>

          <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
            <input 
            type="text" 
            placeholder="Descrição" 
            required 
            {...register('description')}/>

            <input 
            type="number" 
            placeholder="Preço" 
            required 
            {...register('price', { valueAsNumber: true})}/>

            <input 
            type="text" 
            placeholder="Categoria" 
            required 
            {...register('category')}
          />
            
          <Controller
            control={control}
            name="type"
            render={({ field }) => {
            // console.log(props)
            // Função que retorna o conteúdo/HTML relacionado inserido no type do formulário
              //console.log(field)
              return (
                <TransactionType 
                onValueChange={field.onChange} 
                value={field.value}
                >
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              );       
            }}
          />

            <button type="submit" disabled={isSubmitting}>Cadastrar</button>
          </form>

        </Content>
      </Dialog.Portal>
    );
}

/* Quando temos campos com elementos nativos do HTML conseguimos usar a função register. No caso que queremos inserir uma informação que não vem de um campo nativo do HTML e/ou um input, precisamos usar uma API/formato de control*/

/* Formas de passar dados no reacthookform: controlled (usa a API de controle)e uncontrolled. Uncontrolled é quando buscamos a informação do input  somente quando o usuário da um submit. Controlled é quando guarda o valor da informação do usuário cada vez que ele é atualizado. */

/* Linha 74: o formState traz informações do formulário como um todo
O fieldState traz informações sobre o type. Já o field é onde estão os eventos que poderão ter os campos alterados. */