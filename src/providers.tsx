import type { ReactNode } from "react"
import { UserProvider } from "./context/currentUserContext"
import { AppProvider } from "./context/appContext"

const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <UserProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </UserProvider>
    )
}

export default AppProviders
