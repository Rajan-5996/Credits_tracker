// import EntityCard from "@/components/dashboard/entity_card"

import { DomainCredits, LowCreditUsage, TopCreditUsage } from "@/components"

const DashboardPage = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#fff7e8] via-[#fffdf6] to-[#ffeedd] px-4 py-8 sm:px-6 lg:px-10">
            <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-36 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

            <section className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <DomainCredits name="GWC Data.ai" url="https://gwcteq-partner.domo.com/" />
                    <TopCreditUsage />
                    <LowCreditUsage />
                </div>
            </section>

            {/* <div className="absolute top-4 right-4 w-2xl h-128 shadow-lg rounded-xl overflow-hidden border border-amber-200 bg-white">
                <EntityCard />
            </div> */}

        </main>
    )
}

export default DashboardPage
