import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { BookingStatus } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookCopy, CheckCircle, Clock } from "lucide-react";

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-amber-500 hover:bg-amber-500/90",
  confirmed: "bg-green-500 hover:bg-green-500/90",
  cancelled: "bg-red-500 hover:bg-red-500/90",
};

export default async function AdminDashboard() {
  const supabase = createClient();

  // Fetch stats in parallel
  const [totalRes, pendingRes, confirmedRes, recentBookingsRes] = await Promise.all([
    supabase.from("bookings").select('*', { count: 'exact', head: true }),
    supabase.from("bookings").select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from("bookings").select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from("bookings").select("*, stays(name)").order("created_at", { ascending: false }).limit(10),
  ]);

  const totalBookings = totalRes.count ?? 0;
  const pendingBookings = pendingRes.count ?? 0;
  const confirmedBookings = confirmedRes.count ?? 0;
  const recentBookings = recentBookingsRes.data ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All-time booking requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">Confirmed and active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>A list of the 10 most recent booking requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead className="hidden md:table-cell">Stay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Requested On</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.guest_name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {booking.guest_email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{booking.stays?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[booking.status as BookingStatus]}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{format(new Date(booking.created_at), "PPP")}</TableCell>
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
    </div>
  );
}
