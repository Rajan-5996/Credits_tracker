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

const headers = [
    "UserId",
    "Name",
    "Status",
    "credits",
    "Action"
]

type UsersDataTableProps = Readonly<{
    searchValue: string
    statusValue: string
}>

function UsersDataTable({ searchValue, statusValue }: UsersDataTableProps) {
    const app = useContext(AppContext)
    const [users, setUsers] = useState<Array<{ User_ID: string, Name: string, Status: string, credits: number }>>([])
    const [currentPage, setCurrentPage] = useState(1)

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
        <div className="flex h-full flex-col gap-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedUsers.map((user) => (
                        <TableRow key={user.User_ID}>
                            <TableCell className="font-medium">{user.User_ID}</TableCell>
                            <TableCell>{user.Name}</TableCell>
                            <TableCell>{user.Status}</TableCell>
                            <TableCell>{user.credits}</TableCell>
                            <TableCell>
                                <Button variant="link" size="sm" className="px-0" onClick={() => globalThis.window.location.href = `https://gwcteq-partner.domo.com/up/${user.User_ID}`}
                                >
                                    View profile
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {paginatedUsers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background/90 px-3 py-2">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredUsers.length} of {users.length} users
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
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