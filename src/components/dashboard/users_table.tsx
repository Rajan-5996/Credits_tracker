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
import { TbClipboard, TbClipboardCheck, TbChevronDown, TbChevronUp } from "react-icons/tb";
import { Eye, Database, Activity, GitBranch } from "lucide-react"
import { useNavigate } from "react-router-dom"

const headers = [
    "User ID",
    "Name",
    "Status",
    "Credits",
    "Actions"
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
                setCurrentPage(1)
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
        <div className="flex flex-col h-full w-full bg-white border border-gray-300 rounded-sm">
            <div className="flex-1 overflow-auto">
                <Table className="min-w-[1000px] table-fixed text-sm border-collapse w-full">
                    <TableHeader className="bg-[#f8f9fa] border-b border-gray-300">
                        <TableRow className="hover:bg-[#f8f9fa]">
                            {headers.map((header) => (
                                <TableHead
                                    key={header}
                                    className="w-1/5 text-left align-middle font-medium text-gray-700 py-2.5 px-4 sticky top-0 bg-[#f8f9fa] shadow-[0_1px_0_0_#d1d5db]"
                                >
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <><TableRow
                                key={user.User_ID}
                                className={`border-b border-gray-200 hover:bg-[#f8f9fa] transition-colors cursor-default ${expandedRow === user.User_ID ? 'bg-[#f1f5f9]' : 'bg-white'}`}
                            >
                                <TableCell className="w-1/5 px-4 font-mono text-[13px] text-gray-500 py-2">{user.User_ID}</TableCell>
                                <TableCell className="w-1/5 px-4 font-medium text-gray-900 py-2">{user.Name}</TableCell>
                                <TableCell className="w-1/5 px-4 py-2">
                                    <span className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${user.Status.toLowerCase() === 'active' ? 'bg-[#188038]' : 'bg-[#d93025]'}`} />
                                        <span className={`text-[12px] capitalize font-medium ${user.Status.toLowerCase() === 'active' ? 'text-[#188038]' : 'text-[#d93025]'}`}>
                                            {user.Status}
                                        </span>
                                    </span>
                                </TableCell>
                                <TableCell className="w-1/5 px-4 py-2">
                                    <span className="text-gray-900 text-sm font-medium">{formatCompactNumber(user.credits)}</span>
                                </TableCell>
                                <TableCell className="w-1/5 px-4 py-2">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleRow(user.User_ID)}
                                            className={`p-1.5 rounded transition-all flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 ${expandedRow === user.User_ID ? 'bg-gray-200 text-gray-900' : ''}`}
                                            title="Expand details"
                                        >
                                            {expandedRow === user.User_ID ? <TbChevronUp size={16} /> : <TbChevronDown size={16} />}
                                        </button>

                                        <button
                                            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-[#1a73e8] transition-all flex items-center justify-center"
                                            onClick={() => navigate(`/user-items/${user.User_ID}`)}
                                            title="View Visual Lineage"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            className={`p-1.5 rounded hover:bg-gray-200 transition-all flex items-center justify-center ${copiedId === user.User_ID ? 'text-[#188038]' : 'text-gray-600'}`}
                                            onClick={() => handleCopy(user.User_ID, `https://gwcteq-partner.domo.com/up/${user.User_ID}`)}
                                            title="Copy Domo Admin Link"
                                        >
                                            {copiedId === user.User_ID ? <TbClipboardCheck size={16} /> : <TbClipboard size={16} />}
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>

                                {expandedRow === user.User_ID && (
                                    <TableRow key={`${user.User_ID}-expanded`} className="bg-[#f8f9fa] border-b border-gray-300">
                                        <TableCell colSpan={5} className="p-0 border-l-[3px] border-l-[#1a73e8]">
                                            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 min-h-[100px]">
                                                {loadingDetails ? (
                                                    <div className="w-full flex items-center justify-center min-h-[100px]">
                                                        <div className="w-6 h-6 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                ) : expandedData ? (
                                                    <>
                                                        <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-12 pl-2">
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-1.5 mb-1 text-gray-700">
                                                                    <Database size={14} className="text-gray-500" />
                                                                    <span className="font-semibold text-[11px] uppercase tracking-wide">Datasets Configured</span>
                                                                </div>
                                                                <div className="text-2xl font-medium text-gray-900 mt-1">{expandedData.datasets?.count || 0}</div>
                                                                <div className="text-[12px] text-gray-500 mt-1">Cards Powered: {expandedData.datasets?.cardsPowered || 0}</div>
                                                            </div>

                                                            <div className="w-px h-12 bg-gray-300" />

                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-1.5 mb-1 text-gray-700">
                                                                    <Activity size={14} className="text-gray-500" />
                                                                    <span className="font-semibold text-[11px] uppercase tracking-wide">Dataflows Triggered</span>
                                                                </div>
                                                                <div className="text-2xl font-medium text-gray-900 mt-1">{expandedData.dataflows?.count || 0}</div>
                                                                <div className="text-[12px] text-gray-500 mt-1">Active States: {expandedData.dataflows?.activeCount || 0}</div>
                                                            </div>

                                                            <div className="w-px h-12 bg-gray-300" />

                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-1.5 mb-1 text-gray-700">
                                                                    <GitBranch size={14} className="text-gray-500" />
                                                                    <span className="font-semibold text-[11px] uppercase tracking-wide">Workflows Active</span>
                                                                </div>
                                                                <div className="text-2xl font-medium text-gray-900 mt-1">{expandedData.workflows?.count || 0}</div>
                                                                <div className="text-[12px] text-gray-500 mt-1">Running Instances: {expandedData.workflows?.activeCount || 0}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 bg-white p-3 border border-gray-200 rounded-sm shadow-sm mr-2">
                                                            <p className="text-[12px] text-gray-600 max-w-[200px] leading-tight">
                                                                Access complete topology
                                                            </p>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => navigate(`/user-items/${user.User_ID}`)}
                                                                className="text-[12px] h-8 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-sm font-medium whitespace-nowrap px-4 shrink-0"
                                                            >
                                                                Open Sub-Console
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full flex items-center justify-center text-sm text-gray-500 min-h-[100px]">No provisioning data available.</div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}</>
                        ))}
                        {paginatedUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-gray-500">
                                    <div className="text-sm">No items to display</div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between py-2 px-4 border-t border-gray-300 bg-[#f8f9fa] text-sm">
                <p className="text-gray-600">
                    {filteredUsers.length > 0 ? (
                        <>
                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} entities
                        </>
                    ) : (
                        "No entities found"
                    )}
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 tabular-nums">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                        <button
                            className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 font-medium text-[13px] border-r border-gray-300 disabled:opacity-50 disabled:bg-gray-100"
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        <button
                            className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 font-medium text-[13px] disabled:opacity-50 disabled:bg-gray-100"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersDataTable
