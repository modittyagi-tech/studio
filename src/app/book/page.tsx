"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

const availabilitySchema = z.object({
  checkIn: z.date({ required_error: "Check-in date is required." }),
  checkOut: z.date({ required_error: "Check-out date is required." }),
  adults: z.coerce.number().min(1, "At least one adult is required."),
  children: z.coerce.number().min(0).default(0),
}).refine(data => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date.",
  path: ["checkOut"],
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
      const { data: stays, error } = await supabase
        .from('stays')
        .select('*')
        .gte('max_guests', totalGuests);

      if (error) throw error;
      
      // In a real app, you would also check for booking conflicts in the 'bookings' table
      // For this example, we are only filtering by guest count.
      setAvailableStays(stays || []);

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
          check_in: bookingDetails.checkIn.toISOString(),
          check_out: bookingDetails.checkOut.toISOString(),
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
              <form onSubmit={availabilityForm.handleSubmit(onCheckAvailability)} className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-end">
                <FormField
                  control={availabilityForm.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={availabilityForm.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-out</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
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
                        <Input type="number" min="1" {...field} />
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
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" disabled={isLoading} className="w-full h-11">
                  {isLoading ? "Searching..." : "Check Availability"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Section>

      <div className="bg-secondary/30">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book: {selectedStay?.name}</DialogTitle>
            <DialogDescription>
              Please provide your details to request the booking. We will contact you to confirm.
            </DialogDescription>
          </DialogHeader>
          <Form {...bookingForm}>
            <form onSubmit={bookingForm.handleSubmit(onBookStay)} className="space-y-4 pt-4">
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
              <div className="pt-6">
                <Button type="submit" className="w-full" disabled={bookingForm.formState.isSubmitting}>
                  {bookingForm.formState.isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
