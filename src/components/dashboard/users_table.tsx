import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "@/context/appContext"
import { DetailsContext } from "@/context/detailsContext"
import { formatCompactNumber } from "@/lib/utils"
import { TbClipboard, TbClipboardCheck, TbChevronDown, TbDatabase, TbActivity, TbGitBranch, TbCode } from "react-icons/tb";
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import React from "react";

const headers = [
    "User ID",
    "Identity",
    "Node status",
    "Credit balance",
    "Operations"
]

type UsersDataTableProps = Readonly<{
    searchValue: string
    statusValue: string
}>

function UsersDataTable({ searchValue, statusValue }: UsersDataTableProps) {
    const app = useContext(AppContext)
    const details = useContext(DetailsContext)
    const [users, setUsers] = useState<Array<{ User_ID: string, Name: string, Status: string, credits: number }>>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [expandedData, setExpandedData] = useState<any>(null)
    const [loadingDetails, setLoadingDetails] = useState<boolean>(false)

    const navigate = useNavigate();

    const handleCopy = (id: string, url: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const toggleRow = async (userId: string) => {
        if (expandedRow === userId) {
            setExpandedRow(null);
            return;
        }

        setExpandedRow(userId);
        if (details) {
            setLoadingDetails(true);
            try {
                const data = await details.fetchdatasetCount(userId);
                setExpandedData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDetails(false);
            }
        }
    }

    const pageSize = 15

    const filteredUsers = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase()
        const normalizedStatus = statusValue.trim().toLowerCase()

        return users.filter((user) => {
            const matchesSearch = !normalizedSearch ||
                user.User_ID.toLowerCase().includes(normalizedSearch) ||
                user.Name.toLowerCase().includes(normalizedSearch)

            const matchesStatus = normalizedStatus === "all" ||
                user.Status.toLowerCase() === normalizedStatus

            return matchesSearch && matchesStatus
        })
    }, [searchValue, statusValue, users])

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredUsers.length / pageSize))
    }, [filteredUsers.length])

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredUsers.slice(start, end)
    }, [filteredUsers, currentPage])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await app?.userTableData();
                setUsers(res ?? [])
            } catch {
                setUsers([])
            }
        }
        fetchUsers()
    }, [app])

    useEffect(() => {
        setCurrentPage(1)
        setExpandedRow(null)
    }, [searchValue, statusValue])

    const handlePrevious = () => setCurrentPage((prev) => Math.max(1, prev - 1))
    const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))

    return (
        <div className="flex flex-col w-full bg-white border border-primary/5 rounded-xl overflow-hidden shadow-2xl p-1">
            <div className="w-full">


                <Table className="min-w-[1000px] table-fixed text-[13px] border-collapse w-full">
                    <TableHeader className="relative z-20">
                        <TableRow className="border-b border-primary/10 hover:bg-transparent bg-white/95">
                            {headers.map((header) => (
                                <TableHead
                                    key={header}
                                    className="w-1/5 text-left align-middle py-6 px-8 sticky top-0 bg-white/95 backdrop-blur-3xl z-30"
                                >
                                    <span className="text-[11px] font-black capitalize tracking-[0.2em] text-primary">{header}</span>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <React.Fragment key={user.User_ID}>
                                <TableRow
                                    className={`border-b border-primary/5 transition-all duration-300 hover:bg-primary/[0.04] cursor-default font-sans ${expandedRow === user.User_ID ? 'bg-secondary/40' : 'bg-transparent'}`}
                                >
                                    <TableCell className="w-1/5 px-8 py-5 font-mono text-xs text-muted-foreground">{user.User_ID}</TableCell>
                                    <TableCell className="w-1/5 px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-foreground tracking-tight leading-none capitalize">{user.Name}</span>
                                            <span className="text-[9px] font-black text-primary/40 capitalize tracking-[0.15em] mt-2">Active node</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-1/5 px-8 py-5">
                                        <div className={`
                                            inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black capitalize tracking-widest border shadow-sm transition-colors
                                            ${user.Status.toLowerCase() === 'active' 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                                                : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'}
                                        `}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2.5 ${user.Status.toLowerCase() === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`} />
                                            {user.Status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-1/5 px-8 py-5">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-black text-foreground font-heading tracking-tight gwc-text-gradient">{formatCompactNumber(user.credits)}</span>
                                            <span className="text-[10px] font-black text-primary/30 capitalize tracking-widest">CR</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-1/5 px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleRow(user.User_ID)}
                                                title="Expand Metrics"
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border ${expandedRow === user.User_ID ? 'bg-primary text-white border-primary rotate-180 shadow-lg shadow-primary/20' : 'bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white'}`}
                                            >
                                                <TbChevronDown size={16} />
                                            </button>

                                            <button
                                                title="Open Mainframe"
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-primary hover:bg-primary hover:text-white border border-primary/5 transition-all duration-300 shadow-md"
                                                onClick={() => navigate(`/user-items/${user.User_ID}`)}
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                title="Copy Node Address"
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${copiedId === user.User_ID ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200' : 'bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white'}`}
                                                onClick={() => handleCopy(user.User_ID, `https://gwcteq-partner.domo.com/up/${user.User_ID}`)}
                                            >
                                                {copiedId === user.User_ID ? <TbClipboardCheck size={16} /> : <TbClipboard size={16} />}
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {expandedRow === user.User_ID && (
                                    <TableRow key={`${user.User_ID}-expanded`} className="bg-secondary/15 hover:bg-secondary/20 transition-colors">
                                        <TableCell colSpan={ headers.length } className="p-0 border-none">
                                            <div className="p-10 flex flex-wrap items-center justify-between gap-12 min-h-[160px] animate-in fade-in zoom-in slide-in-from-top-3 duration-500">
                                                {loadingDetails ? (
                                                    <div className="w-full flex items-center justify-center min-h-[100px]">
                                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                ) : expandedData ? (
                                                    <>
                                                        <div className="flex flex-wrap items-center gap-12 pl-6">
                                                            <div className="flex flex-col group/item min-w-[140px]">
                                                                 <div className="flex items-center gap-3 mb-3">
                                                                     <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                                                         <TbDatabase size={18} />
                                                                     </div>
                                                                     <span className="font-black text-[11px] capitalize tracking-widest text-primary/60">Datasets</span>
                                                                 </div>
                                                                <div className="text-3xl font-black text-foreground font-heading tracking-tight decoration-accent/40 underline decoration-2 underline-offset-4">{expandedData.datasets?.count || 0}</div>
                                                            </div>

                                                            <div className="w-[1px] h-12 bg-primary/10" />

                                                            <div className="flex flex-col group/item min-w-[140px]">
                                                                 <div className="flex items-center gap-3 mb-3">
                                                                     <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                                                         <TbActivity size={18} />
                                                                     </div>
                                                                     <span className="font-black text-[11px] capitalize tracking-widest text-primary/60">Dataflows</span>
                                                                 </div>
                                                                <div className="text-3xl font-black text-foreground font-heading tracking-tight decoration-primary/40 underline decoration-2 underline-offset-4">{expandedData.dataflows?.count || 0}</div>
                                                            </div>

                                                            <div className="w-[1px] h-12 bg-primary/10" />

                                                            <div className="flex flex-col group/item min-w-[140px]">
                                                                 <div className="flex items-center gap-3 mb-3">
                                                                     <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                                                         <TbGitBranch size={18} />
                                                                     </div>
                                                                     <span className="font-black text-[11px] capitalize tracking-widest text-primary/60">Workflows</span>
                                                                 </div>
                                                                <div className="text-3xl font-black text-foreground font-heading tracking-tight decoration-accent/40 underline decoration-2 underline-offset-4">{expandedData.workflows?.count || 0}</div>
                                                            </div>

                                                            <div className="w-[1px] h-12 bg-primary/10" />

                                                            <div className="flex flex-col group/item min-w-[140px]">
                                                                 <div className="flex items-center gap-3 mb-3">
                                                                     <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                                                         <TbCode size={18} />
                                                                     </div>
                                                                     <span className="font-black text-[11px] capitalize tracking-widest text-primary/60">Jupyter</span>
                                                                 </div>
                                                                <div className="text-3xl font-black text-foreground font-heading tracking-tight decoration-primary/40 underline decoration-2 underline-offset-4">{expandedData.jupyter?.count || 0}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-3 p-6 rounded-xl border border-primary/5 shadow-xl bg-white shrink-0 mx-4">
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black text-foreground capitalize tracking-widest opacity-60">Identity core synchronized</p>
                                                            </div>
                                                            <Button
                                                                onClick={() => navigate(`/user-items/${user.User_ID}`)}
                                                                className="h-10 px-8 gwc-gradient text-white text-[10px] font-black capitalize tracking-widest rounded-full shadow-lg hover:scale-105 transition-all"
                                                            >
                                                                Explore Map
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full flex items-center justify-center text-xs font-black capitalize tracking-widest text-muted-foreground min-h-[120px]">Intelligence relay offline</div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between py-5 px-8 gap-5 border-t border-primary/10 bg-white/70 backdrop-blur-3xl relative z-30">
                <p className="text-[11px] font-black text-primary/60 capitalize tracking-widest">
                    Cluster visualization: <span className="text-foreground">{(currentPage - 1) * pageSize + 1} — {Math.min(currentPage * pageSize, filteredUsers.length)}</span> / <span className="text-foreground font-heading italic text-md ml-1">{filteredUsers.length}</span> nodes
                </p>
                <div className="flex items-center gap-8">
                    <span className="text-[11px] font-black text-primary capitalize tracking-widest tabular-nums font-mono">
                        Console <span className="font-heading italic mx-1.5 text-foreground text-lg">{currentPage}</span> of {totalPages}
                    </span>
                    <div className="flex gap-3 p-2 bg-primary/5 rounded-full border border-primary/10 shadow-inner">
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary hover:bg-primary hover:text-white shadow-xl transition-all duration-300 disabled:opacity-20 hover:scale-110 active:scale-95"
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            <TbChevronDown className="rotate-90" size={18} />
                        </button>
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary hover:bg-primary hover:text-white shadow-xl transition-all duration-300 disabled:opacity-20 hover:scale-110 active:scale-95"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            <TbChevronDown className="-rotate-90" size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersDataTable
