
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import type { Stay } from "@/lib/types";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Minus, Plus, Users, Bed } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isAfter, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import { MotionDiv } from "@/components/motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PageHeader } from "@/components/page-header";
import { Textarea } from "@/components/ui/textarea";

// Schema for the main availability search form
const availabilitySchema = z.object({
  dates: z.object({
    from: z.date({ required_error: "Check-in date is required." }),
    to: z.date({ required_error: "Check-out date is required." }),
  }),
  adults: z.coerce.number().min(1, "At least one adult is required."),
  children: z.coerce.number().min(0).default(0),
  rooms: z.coerce.number().min(1, "At least one room is required."),
}).refine(data => data.dates.to && data.dates.from && isAfter(data.dates.to, data.dates.from), {
  message: "Check-out date must be after check-in date.",
  path: ["dates"],
});

// Schema for the final booking submission form
const bookingSchema = z.object({
  guest_name: z.string().min(2, "Name must be at least 2 characters."),
  guest_email: z.string().email("Please enter a valid email address."),
  guest_phone: z.string().optional(),
  special_requests: z.string().optional(),
});

type SearchParams = z.infer<typeof availabilitySchema>;

// Represents a stay with its real-time availability
interface AvailableStay extends Stay {
  available_rooms: number;
}

export default function BookPage() {
  const [step, setStep] = useState<"search" | "results" | "confirmation">("search");
  const [availableStays, setAvailableStays] = useState<AvailableStay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const [selectedStay, setSelectedStay] = useState<AvailableStay | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [finalBookingId, setFinalBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const availabilityForm = useForm<SearchParams>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      adults: 2,
      children: 0,
      rooms: 1,
    },
  });

  const bookingForm = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  // Effect to safely initialize dates on the client to avoid hydration mismatch
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    const initialDates = {
        from: addDays(new Date(), 1),
        to: addDays(new Date(), 5),
    };
    availabilityForm.setValue('dates', initialDates);
  }, [availabilityForm]);
  
  // Calculate total guests for display and validation
  const totalGuests = useMemo(() => {
    const values = availabilityForm.getValues();
    return (values.adults || 0) + (values.children || 0);
  }, [availabilityForm.watch('adults'), availabilityForm.watch('children')]);


  // Handler for the "Check Availability" button
  async function onCheckAvailability(values: SearchParams) {
    setIsLoading(true);
    setSearchPerformed(true);
    setAvailableStays([]);
    setSearchParams(values);
    setStep("search"); // Stay on search step but show loader

    const { from: check_in, to: check_out } = values.dates;

    if (!check_in || !check_out) {
        toast({
            variant: "destructive",
            title: "Invalid Dates",
            description: "Please select both a check-in and check-out date.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const { data, error } = await supabase.rpc('get_available_stays', {
        p_check_in: check_in.toISOString().split('T')[0],
        p_check_out: check_out.toISOString().split('T')[0],
      });

      if (error) throw error;
      
      const staysWithAvailability = (data as any[])
        .map(stay => ({ ...stay, available_rooms: stay.total_rooms - (stay.booked_rooms || 0) }))
        .filter(stay => 
            (stay.available_rooms >= values.rooms) &&
            (stay.max_guests_per_room * values.rooms) >= (values.adults + values.children)
        );

      setAvailableStays(staysWithAvailability);
      setStep("results");

    } catch (error: any) {
      console.error('Error fetching stays:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error.message || "Could not fetch available stays. Please try again.",
      });
      setStep("search"); // Revert to search step on error
    } finally {
      setIsLoading(false);
    }
  }
  
  // Handler for the final "Confirm Booking" submission
  async function onBookStay(values: z.infer<typeof bookingSchema>) {
    if (!selectedStay || !searchParams) return;

    try {
      const { data, error } = await supabase.from('bookings').insert([
        {
          stay_id: selectedStay.id,
          check_in: searchParams.dates.from.toISOString(),
          check_out: searchParams.dates.to.toISOString(),
          adults: searchParams.adults,
          children: searchParams.children,
          rooms_booked: searchParams.rooms,
          guest_name: values.guest_name,
          guest_email: values.guest_email,
          guest_phone: values.guest_phone,
          special_requests: values.special_requests,
          status: 'pending',
        },
      ]).select('id').single();

      if (error) throw error;

      setFinalBookingId(data.id);
      setStep("confirmation");
      window.scrollTo(0, 0);

    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was a problem submitting your booking. Please try again.",
      });
    }
  }
  
  const handleSelectStay = (stay: AvailableStay) => {
    setSelectedStay(stay);
    bookingForm.reset();
    window.scrollTo(0, 0);
  };
  
  const handleModifySearch = () => {
    setStep('search');
    setSelectedStay(null);
    setSearchPerformed(false);
  }

  const nights = searchParams?.dates.from && searchParams?.dates.to ? differenceInDays(searchParams.dates.to, searchParams.dates.from) : 0;

  if (!hasMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }
  
  if (step === 'confirmation' && finalBookingId) {
    return (
        <div className="bg-background">
            <PageHeader title="Booking Confirmed!" description="Your escape is officially on the calendar."/>
            <section className="py-16 md:py-24">
                <div className="container max-w-3xl text-center">
                    <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/30 border rounded-2xl p-8 md:p-12">
                        <h2 className="font-headline text-3xl text-primary">Thank You, {bookingForm.getValues('guest_name')}!</h2>
                        <p className="text-muted-foreground mt-4 text-lg">
                            We've received your booking request and a confirmation email is on its way to you.
                        </p>
                        <div className="mt-8 text-left bg-card p-6 rounded-lg border">
                            <p className="text-sm text-muted-foreground">Your Booking ID</p>
                            <p className="font-mono text-primary text-lg font-bold">{finalBookingId}</p>
                            <div className="mt-6 border-t pt-6 space-y-3">
                                <div className="flex justify-between items-center"><span className="text-muted-foreground">Stay:</span><span className="font-bold">{selectedStay?.name}</span></div>
                                <div className="flex justify-between items-center"><span className="text-muted-foreground">Check-in:</span><span className="font-bold">{searchParams?.dates.from && format(searchParams.dates.from, "PPP")}</span></div>
                                <div className="flex justify-between items-center"><span className="text-muted-foreground">Check-out:</span><span className="font-bold">{searchParams?.dates.to && format(searchParams.dates.to, "PPP")}</span></div>
                                <div className="flex justify-between items-center"><span className="text-muted-foreground">Guests:</span><span className="font-bold">{totalGuests}</span></div>
                                <div className="flex justify-between items-center"><span className="text-muted-foreground">Rooms:</span><span className="font-bold">{searchParams?.rooms}</span></div>
                            </div>
                        </div>
                         <Button asChild size="lg" className="mt-10">
                            <a href="/">Back to Home</a>
                         </Button>
                    </MotionDiv>
                </div>
            </section>
        </div>
    )
  }

  if (selectedStay && searchParams) {
    const totalPrice = nights * selectedStay.price_per_night * searchParams.rooms;
    return (
        <div className="bg-background">
            <PageHeader title="Complete Your Booking" description={`You're just a few steps away from securing your stay at ${selectedStay.name}.`}/>
             <section className="py-16 md:py-24">
                <div className="container max-w-6xl">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                           <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                             <h2 className="font-headline text-3xl text-primary mb-6">Enter Your Details</h2>
                             <div className="bg-card border rounded-2xl p-6 md:p-8">
                                <Form {...bookingForm}>
                                    <form onSubmit={bookingForm.handleSubmit(onBookStay)} className="space-y-6">
                                        <FormField control={bookingForm.control} name="guest_name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={bookingForm.control} name="guest_email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={bookingForm.control} name="guest_phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number (Optional)</FormLabel>
                                                <FormControl><Input placeholder="+1 555-123-4567" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={bookingForm.control} name="special_requests" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Special Requests (Optional)</FormLabel>
                                                <FormControl><Textarea placeholder="e.g., late check-in, dietary needs" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <div className="pt-4">
                                            <Button type="submit" size="lg" className="w-full" disabled={bookingForm.formState.isSubmitting}>
                                                {bookingForm.formState.isSubmitting ? "Submitting..." : "Confirm Booking"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                             </div>
                           </MotionDiv>
                        </div>
                        <div className="lg:col-span-1">
                            <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}}>
                                <div className="sticky top-24">
                                    <h2 className="font-headline text-3xl text-primary mb-6">Your Stay</h2>
                                    <div className="bg-card border rounded-2xl overflow-hidden">
                                        {PlaceHolderImages.find(i => i.id === selectedStay.images[0]) &&
                                          <Image 
                                            src={PlaceHolderImages.find(i => i.id === selectedStay.images[0])!.imageUrl} 
                                            alt={selectedStay.name} 
                                            width={600} 
                                            height={400} 
                                            className="w-full object-cover"
                                            />
                                        }
                                        <div className="p-6">
                                            <h3 className="font-headline text-xl">{selectedStay.name}</h3>
                                            <div className="mt-4 pt-4 border-t space-y-3 text-sm">
                                                <div className="flex justify-between"><span>Check-in:</span> <span className="font-medium">{format(searchParams.dates.from, "PPP")}</span></div>
                                                <div className="flex justify-between"><span>Check-out:</span> <span className="font-medium">{format(searchParams.dates.to, "PPP")}</span></div>
                                                <div className="flex justify-between"><span>Guests:</span> <span className="font-medium">{totalGuests}</span></div>
                                                <div className="flex justify-between"><span>Rooms:</span> <span className="font-medium">{searchParams.rooms}</span></div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t space-y-2">
                                                 <div className="flex justify-between text-sm"><span>{searchParams.rooms} room × {nights} nights × ${selectedStay.price_per_night}</span> <span>${nights * selectedStay.price_per_night * searchParams.rooms}</span></div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t flex justify-between items-baseline">
                                                <span className="font-bold text-lg">Total Price</span>
                                                <span className="font-bold text-2xl text-primary">${totalPrice.toLocaleString()}</span>
                                            </div>
                                            <Button variant="outline" className="w-full mt-6" onClick={() => setSelectedStay(null)}>Change Selection</Button>
                                        </div>
                                    </div>
                                </div>
                            </MotionDiv>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
  }

  return (
    <div className="bg-background">
      <PageHeader title="Book Your Stay" description="Check availability and find your perfect escape." />

      <section className="py-16 md:-mt-28 relative z-10">
        <div className="container max-w-5xl">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-xl">
                    <Form {...availabilityForm}>
                    <form onSubmit={availabilityForm.handleSubmit(onCheckAvailability)} className="grid md:grid-cols-10 gap-4 items-start">
                        
                        <div className="md:col-span-5">
                            <FormField
                            control={availabilityForm.control}
                            name="dates"
                            render={({ field }) => (
                                <FormItem>
                                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                "w-full justify-start text-left font-normal h-16 text-base",
                                                !field.value?.from && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-3 h-5 w-5 text-primary/70" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Check-in</p>
                                                    {field.value?.from ? format(field.value.from, "LLL dd, y") : "Add date"}
                                                </div>
                                            </Button>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                "w-full justify-start text-left font-normal h-16 text-base",
                                                !field.value?.to && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-3 h-5 w-5 text-primary/70" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Check-out</p>
                                                    {field.value?.to ? format(field.value.to, "LLL dd, y") : "Add date"}
                                                </div>
                                            </Button>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.value?.from}
                                        selected={field.value}
                                        onSelect={(range) => {
                                            field.onChange(range);
                                            if (range?.from && range?.to) {
                                                setIsDatePickerOpen(false);
                                            }
                                        }}
                                        numberOfMonths={2}
                                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="pl-2 pt-1" />
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="md:col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="w-full justify-start text-left font-normal h-16 text-base">
                                         <Users className="mr-3 h-5 w-5 text-primary/70" />
                                         <div>
                                            <p className="text-sm text-muted-foreground">Guests & Rooms</p>
                                            <p className="text-foreground">{totalGuests} guest{totalGuests > 1 && 's'}, {availabilityForm.getValues('rooms')} room{availabilityForm.getValues('rooms') > 1 && 's'}</p>
                                         </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Select Guests & Rooms</h4>
                                        </div>
                                        <div className="grid gap-4">
                                            <GuestInputControl form={availabilityForm} name="adults" label="Adults" min={1} />
                                            <GuestInputControl form={availabilityForm} name="children" label="Children" min={0} />
                                            <GuestInputControl form={availabilityForm} name="rooms" label="Rooms" min={1} />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        
                        <div className="md:col-span-2">
                            <Button type="submit" size="lg" disabled={isLoading} className="w-full h-16 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading ? "Searching..." : "Check Availability"}
                            </Button>
                        </div>
                    </form>
                    </Form>
                </div>
            </MotionDiv>
        </div>
      </section>
      
      { (isLoading || searchPerformed) && 
        <div className="bg-secondary/30 min-h-[500px] py-16 md:py-24">
            <div className="container max-w-6xl">
                {isLoading && (
                    <div className="flex flex-col items-center text-center text-muted-foreground">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                        <h3 className="font-headline text-2xl text-primary">Searching for your perfect stay...</h3>
                        <p>Please wait while we check our availability.</p>
                    </div>
                )}
                
                {!isLoading && searchPerformed && availableStays.length === 0 && (
                    <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <h3 className="font-headline text-3xl text-primary">No Stays Available</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">Unfortunately, no stays match your criteria for the selected dates or guest count. Please try different dates or a smaller group.</p>
                        <Button variant="outline" className="mt-6" onClick={() => setSearchPerformed(false)}>Modify Search</Button>
                    </MotionDiv>
                )}
                
                {step === 'results' && !isLoading && availableStays.length > 0 && (
                     <div className="space-y-12">
                        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="font-headline text-center text-4xl md:text-5xl text-primary">Available Stays</h2>
                            <p className="mt-2 text-center text-muted-foreground">
                                {searchParams?.dates.from && format(searchParams.dates.from, 'PPP')} - {searchParams?.dates.to && format(searchParams.dates.to, 'PPP')} ({nights} nights)
                            </p>
                        </MotionDiv>
                        <div className="grid md:grid-cols-1 gap-8">
                            {availableStays.map((stay, index) => {
                                 const image = PlaceHolderImages.find(img => img.id === stay.images[0]) || {imageUrl: `https://picsum.photos/seed/${stay.id}/800/600`, imageHint: stay.name, description: stay.name};
                                 const totalPrice = nights * stay.price_per_night * searchParams!.rooms;
                                return (
                                <MotionDiv key={stay.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                    <div className="bg-card rounded-2xl border shadow-md overflow-hidden grid md:grid-cols-12 gap-0">
                                        <div className="md:col-span-5 relative">
                                            <Image
                                                src={image.imageUrl} alt={stay.name} width={800} height={600}
                                                className="object-cover w-full h-64 md:h-full"
                                                data-ai-hint={image.imageHint}
                                            />
                                        </div>
                                        <div className="md:col-span-7 p-6 md:p-8 flex flex-col">
                                             <h3 className="font-headline text-3xl text-primary">{stay.name}</h3>
                                             <p className="mt-2 text-muted-foreground flex-grow">{stay.short_description}</p>
                                            <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
                                                <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-primary/70" /><span>Up to {stay.max_guests_per_room} guests per room</span></div>
                                                <div className="flex items-center"><Bed className="h-4 w-4 mr-2 text-primary/70" /><span>{stay.available_rooms} rooms available</span></div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t flex flex-col md:flex-row md:justify-between md:items-end">
                                                <div>
                                                     <p className="text-2xl font-bold text-foreground">${totalPrice.toLocaleString()}</p>
                                                     <p className="text-sm font-normal text-muted-foreground">${stay.price_per_night}/night ({nights} nights, {searchParams?.rooms} rooms)</p>
                                                </div>
                                                <Button size="lg" className="w-full md:w-auto mt-4 md:mt-0" onClick={() => handleSelectStay(stay)}>Select Stay</Button>
                                            </div>
                                        </div>
                                    </div>
                                </MotionDiv>
                            )})}
                        </div>
                        <div className="text-center">
                            <Button variant="outline" onClick={handleModifySearch}>Modify Search</Button>
                        </div>
                    </div>
                )}
            </div>
      </div>
    }
    </div>
  );
}


// Helper component for guest/room number inputs
function GuestInputControl({ form, name, label, min }: { form: any, name: "adults" | "children" | "rooms", label: string, min: number }) {
    const value = form.watch(name);
    return (
        <div className="flex items-center justify-between">
            <FormLabel className="font-normal">{label}</FormLabel>
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => form.setValue(name, Math.max(min, value - 1))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Controller
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                         <Input
                            {...field}
                            type="number"
                            min={min}
                            className="h-8 w-12 text-center"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || min)}
                        />
                    )}
                />
                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => form.setValue(name, value + 1)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

// Simple CSS for loader
const styles = `
.loader {
    border-top-color: hsl(var(--primary));
    -webkit-animation: spinner 1.5s linear infinite;
    animation: spinner 1.5s linear infinite;
}
@-webkit-keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
}
@keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

    