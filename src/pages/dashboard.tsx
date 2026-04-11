import { useState } from "react"
import EntityCard from "@/components/dashboard/entity_card"
import { DomainCredits, Filter, LowCreditUsage, TopCreditUsage, UsersDataTable, TotalUsersKpi } from "@/components"

const DashboardPage = () => {
    const [searchValue, setSearchValue] = useState("")
    const [statusValue, setStatusValue] = useState("all")

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f8f9fa] py-4">
            <section className="relative z-10 w-full mb-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <DomainCredits />
                    <TotalUsersKpi />
                    <TopCreditUsage />
                    <LowCreditUsage />
                </div>
            </section>

            <section className="relative z-10 w-full mb-8">
                <div className="h-[720px] w-full">
                    <EntityCard />
                </div>
            </section>

            <section className="relative z-40 w-full mb-8">
                <div className="rounded-sm border border-gray-300 bg-white p-0.5 shadow-sm">
                    <Filter
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        statusValue={statusValue}
                        onStatusChange={setStatusValue}
                    />
                </div>
            </section>

            <section className="relative z-10 w-full pb-8">
                <div className="h-[500px] w-full">
                    <UsersDataTable searchValue={searchValue} statusValue={statusValue} />
                </div>
            </section>
        </main>
    )
}

export default DashboardPage
