import type { ReactNode } from "react"
import { UserProvider } from "./context/currentUserContext"
import { AppProvider } from "./context/appContext"
import { DetailsProvider } from "./context/detailsContext"
import { CardsProvider } from "./context/cardsContext"

const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <UserProvider>
            <AppProvider>
                <DetailsProvider>
                    <CardsProvider>
                        {children}
                    </CardsProvider>
                </DetailsProvider>
            </AppProvider>
        </UserProvider>
    )
}

export default AppProviders
