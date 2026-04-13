import { useState } from "react"
import EntityCard from "@/components/dashboard/entity_card"
import { DomainCredits, LowCreditUsage, TopCreditUsage, UsersDataTable, TotalUsersKpi } from "@/components"
import SearchBar from "@/components/dashboard/filters/searchBar"
import ActionFilter from "@/components/dashboard/filters/action_filter"


const DashboardPage = () => {
    const [searchValue, setSearchValue] = useState("")
    const [statusValue, setStatusValue] = useState("all")

    return (
        <div className="relative h-auto w-full overflow-x-hidden bg-background">
            {/* Background Mesh Gradients */}
            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <main className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-10 pt-6 md:pt-8 pb-0 space-y-6 md:space-y-8">
                {/* Header Strip */}
                <header className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                    <div className="flex flex-col text-center sm:text-left">
                        <h2 className="text-xl md:text-2xl font-black text-foreground font-heading tracking-tight capitalize leading-none">Intelligence dashboard</h2>
                        <p className="text-[10px] font-black text-primary/40 capitalize tracking-[0.2em] mt-2 leading-none uppercase">Global Capacity Orchestration</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100/50 shadow-sm flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocol active</span>
                        </div>
                    </div>
                </header>

                {/* KPI Grid */}
                <section className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-2 overflow-hidden">
                    <TotalUsersKpi />
                    <DomainCredits />
                    <TopCreditUsage />
                    <LowCreditUsage />
                </section>

                {/* Main Operations Center */}
                <div className="space-y-6 md:space-y-10">
                    <section id="topology" className="w-full scroll-mt-24 px-2">
                        <EntityCard />
                    </section>


                    <section id="registry" className="w-full scroll-mt-24 px-2">
                        <div className="flex flex-col gap-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                                <div className="flex flex-col text-center sm:text-left">
                                    <h3 className="text-lg md:text-xl font-black text-foreground font-heading tracking-tight capitalize leading-none">Identity registry</h3>
                                    <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] mt-2">Global Unified entity index</p>
                                </div>
                                <button className="px-8 py-3.5 rounded-full gwc-gradient text-[10px] font-black text-white capitalize tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">Export report</button>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center gap-4 w-full px-4">
                                <div className="w-full lg:flex-1">
                                    <SearchBar value={searchValue} onChange={setSearchValue} />
                                </div>
                                <div className="w-full lg:w-64">
                                    <ActionFilter value={statusValue} onChange={setStatusValue} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-auto overflow-hidden rounded-[2rem] border border-primary/5 shadow-2xl bg-white">
                            <UsersDataTable searchValue={searchValue} statusValue={statusValue} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

