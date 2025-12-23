import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookingStatus } from "@/lib/types"

const statusColors: Record<BookingStatus, string> = {
    pending: "bg-amber-500 hover:bg-amber-500/90",
    confirmed: "bg-green-500 hover:bg-green-500/90",
    cancelled: "bg-red-500 hover:bg-red-500/90",
};

export default async function BookingsPage() {
    const supabase = createClient();
    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*, stays(name)")
        .order("created_at", { ascending: false });
    
    if (error) {
        return <div>Error fetching bookings: {error.message}</div>
    }

    return (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              A list of all booking requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead className="hidden md:table-cell">Stay</TableHead>
                  <TableHead className="hidden md:table-cell">Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Rooms</TableHead>
                  <TableHead className="hidden lg:table-cell">Requested On</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.guest_name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {booking.guest_email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{booking.stays?.name || 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        {format(new Date(booking.check_in), "LLL dd, y")} - {format(new Date(booking.check_out), "LLL dd, y")}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status as BookingStatus]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{booking.rooms_booked}</TableCell>
                    <TableCell className="hidden lg:table-cell">{format(new Date(booking.created_at), "LLL dd, y")}</TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/bookings/${booking.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    )
}
