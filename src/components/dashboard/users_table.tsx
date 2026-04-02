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
import { motion, AnimatePresence } from "framer-motion"
import { formatCompactNumber } from "@/lib/utils"
import { CiShare1 } from "react-icons/ci";
import { TbClipboard, TbClipboardCheck } from "react-icons/tb";

const headers = [
    "UserId",
    "Name",
    "Status",
    "Credits",
    "View Profile"
]

type UsersDataTableProps = Readonly<{
    searchValue: string
    statusValue: string
}>

function UsersDataTable({ searchValue, statusValue }: UsersDataTableProps) {
    const app = useContext(AppContext)
    const [users, setUsers] = useState<Array<{ User_ID: string, Name: string, Status: string, credits: number }>>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = (id: string, url: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const pageSize = 10

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
                setCurrentPage(1)
            } catch {
                setUsers([])
            }
        }
        fetchUsers()
    }, [app])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, statusValue])

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages)
        }
    }, [currentPage, totalPages])

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1))
    }

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Table className="table-fixed border-separate border-spacing-0">
                    <TableHeader className="sticky top-0 z-30">
                        <TableRow className="hover:bg-transparent">
                            {headers.map((header) => (
                                <TableHead
                                    key={header}
                                    className="w-1/5 h-12 text-left align-middle whitespace-nowrap sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border/40 shadow-sm font-bold text-primary py-3 px-4 uppercase text-[0.6rem] tracking-[0.12em]"
                                >
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {paginatedUsers.map((user, idx) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.03 }}
                                    key={user.User_ID}
                                    className="group hover:bg-primary/[0.02] border-b border-border/40 transition-colors"
                                >
                                    <TableCell className="w-1/5 px-4 py-2.5 font-mono text-[10px] text-muted-foreground truncate">{user.User_ID}</TableCell>
                                    <TableCell className="w-1/5 px-4 py-2.5 font-bold text-foreground text-sm truncate">{user.Name}</TableCell>
                                    <TableCell className="w-1/5 px-4 py-2.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${user.Status.toLowerCase() === 'active'
                                            ? 'bg-green-100/50 text-green-700'
                                            : user.Status.toLowerCase() === 'inactive'
                                                ? 'bg-red-100/50 text-red-700'
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {user.Status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="w-1/5 px-4 py-2.5">
                                        <span className="font-bold text-primary text-sm ">{formatCompactNumber(user.credits)}</span>
                                    </TableCell>
                                    <TableCell className="w-1/5 px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title="View Profile"
                                                className="h-9 px-2 text-primary hover:text-primary/80 hover:bg-primary/5 transition-all font-bold border-none text-[10px] uppercase tracking-tight flex items-center gap-1.5"
                                                onClick={() => globalThis.window.location.href = `https://gwcteq-partner.domo.com/up/${user.User_ID}`}
                                            >
                                                <CiShare1 className="text-sm opacity-60" size={15} />
                                            </Button>

                                            <div
                                                className={`h-5 w-5 cursor-pointer transition-all hover:scale-105 active:scale-95 ${copiedId === user.User_ID ? 'text-green-600' : 'text-primary hover:text-primary/80'
                                                    }`}
                                                onClick={() => handleCopy(user.User_ID, `https://gwcteq-partner.domo.com/up/${user.User_ID}`)}
                                                title="Copy profile link"
                                            >
                                                {copiedId === user.User_ID ? (
                                                    <TbClipboardCheck className="animate-in zoom-in duration-300 text-sm opacity-60" size={17} />
                                                ) : (
                                                    <TbClipboard className="text-sm opacity-60" size={17} />
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {paginatedUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-60 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                                            <svg className="w-6 h-6 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium">No users found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-4 border-t border-border/40 bg-secondary/20">
                <p className="text-xs text-muted-foreground font-medium">
                    {filteredUsers.length > 0 ? (
                        <>
                            Showing <span className="text-foreground font-bold">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                            <span className="text-foreground font-bold">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of{" "}
                            <span className="text-foreground font-bold">{filteredUsers.length}</span> results
                        </>
                    ) : (
                        "No results found"
                    )}
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground mr-2 font-bold uppercase tracking-wider">
                        Page {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-9 px-4 rounded-xl border border-primary/20 hover:border-primary/40 hover:bg-primary hover:text-white text-primary transition-all font-bold"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm"
                        className="h-9 px-4 rounded-xl bg-brand-gradient text-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 hover:text-white transition-all font-bold border-none"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UsersDataTable