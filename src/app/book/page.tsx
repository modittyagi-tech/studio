
"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Stay } from "@/lib/types";
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
import { CalendarIcon, Minus, Plus, Users, Bed, AlertCircle, CalendarCheck, BedDouble, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isAfter, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";
import { MotionDiv } from "@/components/motion";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Textarea } from "@/components/ui/textarea";
import { mockStays } from "@/lib/data";
import Section from "@/components/section";

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

// Represents a stay with its real-time availability from Supabase
interface AvailableStay extends Stay {
  available_rooms: number;
}

const bookingSteps = [
    {
        icon: CalendarCheck,
        title: "1. Check Availability",
        description: "Select your desired dates and guest count to find the perfect stay for your escape.",
    },
    {
        icon: BedDouble,
        title: "2. Select Your Stay",
        description: "Browse through the available accommodations and choose the one that best suits your needs.",
    },
    {
        icon: CheckCircle,
        title: "3. Book & Relax",
        description: "Complete your booking with our secure form and get ready to unwind in nature.",
    },
];

export default function BookPage() {
  const [step, setStep] = useState<"search" | "results" | "confirmation">("search");
  const [availableStays, setAvailableStays] = useState<AvailableStay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const [selectedStay, setSelectedStay] = useState<AvailableStay | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [finalBookingId, setFinalBookingId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const availabilityForm = useForm<SearchParams>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      adults: 2,
      children: 0,
      rooms: 1,
      dates: {
        from: undefined,
        to: undefined,
      }
    },
  });

  const bookingForm = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  // Calculate total guests for display and validation
  const totalGuests = useMemo(() => {
    const values = availabilityForm.watch();
    return (values.adults || 0) + (values.children || 0);
  }, [availabilityForm]);

  async function onCheckAvailability(values: SearchParams) {
    setIsLoading(true);
    setSearchPerformed(true);
    setAvailableStays([]);
    setSelectedStay(null);
    setStep("search"); 
    setSearchParams(values);

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
        const { data: availableData, error } = await supabase.rpc('get_available_stays', {
            p_check_in_date: check_in.toISOString(),
            p_check_out_date: check_out.toISOString()
        });

        if (error) throw error;
        
        const staysWithAvailability: AvailableStay[] = availableData
          .map((stay: any) => {
              const mock = mockStays.find(m => m.id === stay.id);
              return {
                  ...mock, // Get images, descriptions etc. from mock
                  ...stay, // Get live availability from supabase
              } as AvailableStay
          })
          .filter((stay: AvailableStay) => {
              const fitsGuests = ((stay.max_adults + stay.max_children) * values.rooms) >= (values.adults + values.children);
              const hasRooms = stay.available_rooms >= values.rooms;
              return fitsGuests && hasRooms;
          });
        
        setAvailableStays(staysWithAvailability);
        setStep("results");

    } catch (error: any) {
        console.error("Error fetching availability:", error);
        toast({
            variant: "destructive",
            title: "Search Failed",
            description: error.message || "Could not fetch available stays. Please try again later.",
        });
        setStep("search"); 
    } finally {
        setIsLoading(false);
    }
  }
  
  async function onBookStay(values: z.infer<typeof bookingSchema>) {
    if (!selectedStay || !searchParams) return;

    setIsLoading(true);
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
          special_requests: values.special_requests ?? null,
          status: 'pending',
        },
      ]).select('id').single();

      if (error) throw error;

      setFinalBookingId(data.id);
      setStep("confirmation");
      window.scrollTo(0, 0);

    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "There was a problem submitting your booking. Please try again.",
      });
    } finally {
        setIsLoading(false);
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
    const heroImage = {imageUrl: `https://picsum.photos/seed/${selectedStay.id}/800/600`, imageHint: selectedStay.name, description: selectedStay.name};
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
                                            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                                {isLoading ? "Submitting..." : "Confirm Booking"}
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
                                        {heroImage &&
                                          <Image 
                                            src={heroImage.imageUrl} 
                                            alt={selectedStay.name} 
                                            width={600} 
                                            height={400} 
                                            className="w-full object-cover"
                                            data-ai-hint={heroImage.imageHint || 'stay image'}
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
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <button
                                            id="date"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                            )}
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className={cn("flex items-center w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm h-16", !field.value?.from && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-3 h-5 w-5 text-primary/70" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Check-in</p>
                                                        <p className="text-base font-medium">{field.value?.from ? format(field.value.from, "LLL dd, y") : "Add date"}</p>
                                                    </div>
                                                </div>
                                                <div className={cn("flex items-center w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm h-16", !field.value?.to && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-3 h-5 w-5 text-primary/70" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Check-out</p>
                                                        <p className="text-base font-medium">{field.value?.to ? format(field.value.to, "LLL dd, y") : "Add date"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={field.value?.from}
                                            selected={field.value}
                                            onSelect={field.onChange}
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
                                            <p className="text-foreground">{totalGuests} guest{totalGuests > 1 && 's'}, {availabilityForm.watch('rooms')} room{availabilityForm.watch('rooms') > 1 && 's'}</p>
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
                            <Button type="submit" size="lg" disabled={isLoading || !availabilityForm.formState.isValid} className="w-full h-16 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading ? "Searching..." : "Check Availability"}
                            </Button>
                        </div>
                    </form>
                    </Form>
                </div>
            </MotionDiv>
        </div>
      </section>

      <div className="bg-background">
          {searchPerformed ? (
            <div className="bg-secondary/30 min-h-[500px] py-16 md:py-24 flex items-center justify-center">
                <div className="container max-w-6xl text-center">
                    {isLoading && (
                        <div className="flex flex-col items-center text-center text-muted-foreground">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                            <h3 className="font-headline text-2xl text-primary">Searching for your perfect stay...</h3>
                            <p>Please wait while we check our availability.</p>
                        </div>
                    )}
                    
                    {!isLoading && availableStays.length === 0 && (
                        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                             <div className="flex justify-center items-center flex-col gap-4 text-center">
                                <AlertCircle className="w-16 h-16 text-primary/30" />
                                <h3 className="font-headline text-3xl text-primary">No Stays Available</h3>
                                <p className="text-muted-foreground mt-2 max-w-md mx-auto">Unfortunately, no stays match your criteria for the selected dates or guest count. Please try different dates or a smaller group.</p>
                                <Button variant="outline" className="mt-6" onClick={handleModifySearch}>
                                    Modify Search
                                </Button>
                            </div>
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
                                     const image = {imageUrl: `https://picsum.photos/seed/${stay.id}/800/600`, imageHint: stay.name, description: stay.name};
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
                                                    <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-primary/70" /><span>Up to {stay.max_adults + stay.max_children} guests per room</span></div>
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
          ) : (
            <Section className="py-24">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl text-primary">Your Journey to Tranquility</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Booking your luxury escape is simple and secure.
                    </p>
                </div>
                <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {bookingSteps.map((step, index) => (
                        <MotionDiv
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 rounded-full p-4 border-2 border-primary/20">
                                    <step.icon className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-headline text-2xl">{step.title}</h3>
                            <p className="mt-2 text-muted-foreground/90">{step.description}</p>
                        </MotionDiv>
                    ))}
                </div>
            </Section>
          )}
      </div>
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
                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => form.setValue(name, Math.max(min, value - 1), { shouldValidate: true })} >
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
                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => form.setValue(name, value + 1, { shouldValidate: true })}>
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
