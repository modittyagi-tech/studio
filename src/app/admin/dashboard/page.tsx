import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server"
import { DollarSign, BookOpen, Clock, CheckCircle, XCircle } from "lucide-react"

export default async function DashboardPage() {
    const supabase = createClient();

    const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("status, stays(price_per_night), check_in, check_out, rooms_booked");

    let totalRevenue = 0;
    let pendingBookings = 0;
    let confirmedBookings = 0;
    let cancelledBookings = 0;

    if (bookings) {
        bookings.forEach(booking => {
            if (booking.status === 'confirmed') {
                const checkIn = new Date(booking.check_in);
                const checkOut = new Date(booking.check_out);
                const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
                totalRevenue += (booking.stays?.price_per_night || 0) * nights * booking.rooms_booked;
                confirmedBookings++;
            } else if (booking.status === 'pending') {
                pendingBookings++;
            } else if (booking.status === 'cancelled') {
                cancelledBookings++;
            }
        });
    }


  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
                Based on confirmed bookings
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                Total Bookings
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
                All-time booking requests
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">+{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
                Awaiting confirmation
            </p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed / Cancelled</CardTitle>
            <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <XCircle className="h-4 w-4 text-red-500" />
            </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                    <span>{confirmedBookings}</span>
                    <span className="text-muted-foreground">/</span>
                    <span>{cancelledBookings}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Confirmed vs. Cancelled bookings
                </p>
            </CardContent>
        </Card>
    </div>
  )
}
