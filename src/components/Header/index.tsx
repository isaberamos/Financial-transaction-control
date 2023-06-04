import { HeaderContainer, HeaderContent, NewTransactionButton } from "./styles";
import * as Dialog from "@radix-ui/react-dialog";


import logo from '../../assets/logo.svg'
import { NewTransactionModal } from "../NewTransactionModal";

export function Header() {
    return (
        <HeaderContainer>
            <HeaderContent>
                <img src={logo} alt="" />

                <Dialog.Root>
                    {/* asChild aproveita o botão do que está dentro do componente */}
                    <Dialog.Trigger asChild>
                        <NewTransactionButton>Nova transação</NewTransactionButton>
                    </Dialog.Trigger>

                <NewTransactionModal/>
                </Dialog.Root>
            </HeaderContent>
        </HeaderContainer>
    )
}