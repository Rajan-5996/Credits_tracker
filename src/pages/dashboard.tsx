import { useState } from "react"
import EntityCard from "@/components/dashboard/entity_card"
import { DomainCredits, Filter, LowCreditUsage, TopCreditUsage, UsersDataTable } from "@/components"

const DashboardPage = () => {
    const [searchValue, setSearchValue] = useState("")
    const [statusValue, setStatusValue] = useState("all")

    return (
        <main className="relative min-h-screen overflow-hidden bg-background px-1 py-4 sm:px-2">
            <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute right-0 top-36 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-[120px]" />
            <section className="relative z-10 mx-auto w-full max-w-395">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 px-1">
                    <DomainCredits />
                    <TopCreditUsage />
                    <LowCreditUsage />
                </div>
            </section>

            <section className="relative z-10 mx-auto mt-4 w-full max-w-395 px-1">
                <div className="h-180 w-full overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl">
                    <EntityCard />
                </div>
            </section>

            <section className="relative z-40 mx-auto mt-4 max-w-395 px-1">
                <div className="rounded-xl border border-white/20 bg-white/30 p-0.5 shadow-sm backdrop-blur-md hover:bg-white/40 hover:border-white/40 transition-all duration-300">
                    <Filter
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        statusValue={statusValue}
                        onStatusChange={setStatusValue}
                    />
                </div>
            </section>

            <section className="relative z-10 mx-auto mt-4 w-full max-w-395 pb-8 px-1">
                <div className="h-130 w-full rounded-md border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl overflow-hidden">
                    <UsersDataTable searchValue={searchValue} statusValue={statusValue} />
                </div>
            </section>
        </main>
    )
}

export default DashboardPage