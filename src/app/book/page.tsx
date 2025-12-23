
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Stay } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import Section from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StayCard } from "@/components/stay-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import type { DateRange } from "react-day-picker";

const availabilitySchema = z.object({
  dates: z.object({
    from: z.date({ required_error: "Check-in date is required." }),
    to: z.date({ required_error: "Check-out date is required." }),
  }),
  adults: z.coerce.number().min(1, "At least one adult is required."),
  children: z.coerce.number().min(0).default(0),
}).refine(data => data.dates.to && data.dates.from && isAfter(data.dates.to, data.dates.from), {
  message: "Check-out date must be after check-in date.",
  path: ["dates"],
});

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
});


export default function BookPage() {
  const [availableStays, setAvailableStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [bookingDetails, setBookingDetails] = useState<z.infer<typeof availabilitySchema> | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();

  const availabilityForm = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      adults: 1,
      children: 0,
      dates: {
        from: new Date(),
        to: addDays(new Date(), 4),
      }
    },
  });

  const bookingForm = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onCheckAvailability(values: z.infer<typeof availabilitySchema>) {
    setIsLoading(true);
    setSearchPerformed(true);
    setAvailableStays([]);
    setBookingDetails(values);

    const totalGuests = values.adults + values.children;

    try {
      const { data: stays, error: staysError } = await supabase
        .from('stays')
        .select('*')
        .gte('max_guests', totalGuests);

      if (staysError) throw staysError;

      // Find which of these stays have conflicting bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('stay_id')
        .in('stay_id', stays.map(s => s.id))
        .or(`[check_in,check_out).overlaps.[${values.dates.from.toISOString()},${values.dates.to.toISOString()})`);
        
      if (bookingsError) throw bookingsError;

      const conflictingStayIds = new Set(bookings.map(b => b.stay_id));
      const filteredStays = stays.filter(stay => !conflictingStayIds.has(stay.id));
      
      setAvailableStays(filteredStays || []);

    } catch (error: any) {
      console.error('Error fetching stays:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Could not fetch available stays. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onBookStay(values: z.infer<typeof bookingSchema>) {
    if (!selectedStay || !bookingDetails) return;

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          stay_id: selectedStay.id,
          check_in: bookingDetails.dates.from.toISOString(),
          check_out: bookingDetails.dates.to.toISOString(),
          adults: bookingDetails.adults,
          children: bookingDetails.children,
          name: values.name,
          email: values.email,
          phone: values.phone,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      toast({
        title: "Booking Request Sent!",
        description: "We've received your request and will contact you shortly to confirm.",
      });
      setIsBookingModalOpen(false);
      bookingForm.reset();

    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was a problem submitting your booking. Please try again.",
      });
    }
  }

  const handleBookNowClick = (stay: Stay) => {
    setSelectedStay(stay);
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Book Your Stay"
        description="Check availability and find your perfect escape."
      />
      <Section>
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border rounded-2xl p-6 md:p-8">
            <Form {...availabilityForm}>
              <form onSubmit={availabilityForm.handleSubmit(onCheckAvailability)} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end">
                
                <FormField
                  control={availabilityForm.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col lg:col-span-2">
                      <FormLabel>Check-in - Check-out</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !field.value.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value.from}
                            selected={field.value as DateRange}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={availabilityForm.control}
                  name="adults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adults</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} className="h-11"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={availabilityForm.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Children</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" disabled={isLoading} className="w-full h-11 lg:col-start-4">
                  {isLoading ? "Searching..." : "Check Availability"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Section>

      <div className="bg-secondary/30 min-h-[400px]">
        <Section>
            {isLoading && <div className="text-center text-muted-foreground">Searching for available stays...</div>}
            
            {!isLoading && searchPerformed && availableStays.length === 0 && (
                <div className="text-center">
                    <h3 className="font-headline text-2xl">No Stays Available</h3>
                    <p className="text-muted-foreground mt-2">Unfortunately, no stays match your criteria. Please try different dates or a smaller group.</p>
                </div>
            )}
            
            {!isLoading && availableStays.length > 0 && (
                 <div className="space-y-10">
                    <h2 className="font-headline text-center text-4xl md:text-5xl text-primary">Available Stays</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {availableStays.map(stay => (
                            <div key={stay.id}>
                                <StayCard stay={stay} />
                                <div className="mt-4">
                                  <Button className="w-full" onClick={() => handleBookNowClick(stay)}>Book This Stay</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Section>
      </div>

       <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book: {selectedStay?.name}</DialogTitle>
            {bookingDetails && (
              <DialogDescription>
                {format(bookingDetails.dates.from, "PPP")} to {format(bookingDetails.dates.to, "PPP")}
              </DialogDescription>
            )}
          </DialogHeader>
          <Form {...bookingForm}>
            <form onSubmit={bookingForm.handleSubmit(onBookStay)} className="space-y-4">
              <FormField
                control={bookingForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={bookingForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={bookingForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={bookingForm.formState.isSubmitting}>
                  {bookingForm.formState.isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

    