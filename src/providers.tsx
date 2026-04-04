import type { ReactNode } from "react"
import { UserProvider } from "./context/currentUserContext"
import { AppProvider } from "./context/appContext"
import { DetailsProvider } from "./context/detailsContext"

const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <UserProvider>
            <AppProvider>
                <DetailsProvider>
                    {children}
                </DetailsProvider>
            </AppProvider>
        </UserProvider>
    )
}

export default AppProviders
