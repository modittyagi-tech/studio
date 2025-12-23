import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { format, differenceInDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { BookingStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Check, X, Phone, Mail, User, BedDouble, Calendar, Hash } from "lucide-react"

const statusColors: Record<BookingStatus, string> = {
    pending: "bg-amber-500 hover:bg-amber-500/90",
    confirmed: "bg-green-500 hover:bg-green-500/90",
    cancelled: "bg-red-500 hover:bg-red-500/90",
};

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    
    const { data: booking, error } = await supabase
        .from("bookings")
        .select("*, stays(*)")
        .eq("id", params.id)
        .single();
        
    if (error || !booking) {
        notFound();
    }
    
    const nights = differenceInDays(new Date(booking.check_out), new Date(booking.check_in));
    const totalPrice = nights * (booking.stays?.price_per_night || 0) * booking.rooms_booked;

    async function updateStatus(newStatus: BookingStatus) {
        "use server";
        const supabase = createClient();
        await supabase.from("bookings").update({ status: newStatus }).eq("id", params.id);
        redirect(`/admin/bookings/${params.id}?updated=true`);
    }

    async function confirmBooking() {
        "use server";
        await updateStatus("confirmed");
    }

    async function cancelBooking() {
        "use server";
        await updateStatus("cancelled");
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>
                        Booking ID: {booking.id.split('-')[0]}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex justify-between items-start">
                     <div>
                        <p className="text-lg font-semibold">{booking.stays?.name}</p>
                        <p className="text-muted-foreground text-sm">Requested on {format(new Date(booking.created_at), "PPP")}</p>
                     </div>
                     <Badge className={statusColors[booking.status as BookingStatus]}>{booking.status}</Badge>
                   </div>
                   
                   <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground"/> <span>{format(new Date(booking.check_in), "PPP")} to {format(new Date(booking.check_out), "PPP")} ({nights} nights)</span></div>
                    <div className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-muted-foreground"/> <span>{booking.rooms_booked} room(s)</span></div>
                    <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> <span>{booking.adults} Adults, {booking.children} Children</span></div>
                   </div>

                   {booking.special_requests && (
                        <div className="pt-4 border-t">
                            <h3 className="font-medium mb-2">Special Requests</h3>
                            <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                        </div>
                   )}
                </CardContent>
                <CardFooter>
                    <div className="text-xl font-bold">
                        Total Price: ${totalPrice.toLocaleString()}
                    </div>
                </CardFooter>
            </Card>

             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Guest Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                         <div className="flex items-center gap-2">
                           <User className="w-4 h-4 text-muted-foreground"/>
                           <span className="font-medium">{booking.guest_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Mail className="w-4 h-4 text-muted-foreground"/>
                           <a href={`mailto:${booking.guest_email}`} className="text-primary hover:underline">{booking.guest_email}</a>
                        </div>
                        {booking.guest_phone &&
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground"/>
                                <a href={`tel:${booking.guest_phone}`} className="text-primary hover:underline">{booking.guest_phone}</a>
                            </div>
                        }
                    </CardContent>
                </Card>

                 {booking.status === 'pending' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <form action={confirmBooking}>
                                <Button size="lg"><Check className="w-4 h-4 mr-2"/> Confirm Booking</Button>
                            </form>
                            <form action={cancelBooking}>
                                <Button size="lg" variant="destructive"><X className="w-4 h-4 mr-2"/> Cancel Booking</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
