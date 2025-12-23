"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { CalendarIcon, Minus, Plus, Users, Bed, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isAfter, differenceInDays } from "date-fns";
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
import { MotionDiv } from "@/components/motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Label } from "@/components/ui/label";


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
      adults: 2,
      children: 0,
    },
  });

  const bookingForm = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
        name: "",
        email: "",
        phone: ""
    }
  });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    availabilityForm.reset({
        adults: 2,
        children: 0,
        dates: {
            from: new Date(),
            to: addDays(new Date(), 4),
        }
    });
  }, [availabilityForm]);


  async function onCheckAvailability(values: z.infer<typeof availabilitySchema>) {
    setIsLoading(true);
    setSearchPerformed(true);
    setAvailableStays([]);
    setBookingDetails(values);

    const totalGuests = values.adults + values.children;

    try {
      // Fake delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { data: stays, error: staysError } = await supabase
        .from('stays')
        .select('*')
        .gte('max_guests', totalGuests);

      if (staysError) throw staysError;
      if (!stays) {
        setAvailableStays([]);
        setIsLoading(false);
        return;
      }

      // In a real app, you'd check for booking conflicts here.
      // For now, we assume all stays are available if they meet capacity.
      setAvailableStays(stays);

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
          status: 'pending', // In a real app, this would be confirmed after payment
        },
      ]);

      if (error) throw error;

      toast({
        title: "Booking Request Sent!",
        description: "We've received your request and will contact you shortly to confirm.",
      });
      setIsBookingModalOpen(false);
      bookingForm.reset();
      // Reset the flow
      setSearchPerformed(false);
      setAvailableStays([]);
      availabilityForm.reset();


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
  
  const totalGuests = availabilityForm.watch('adults') + availabilityForm.watch('children');
  const dateRange = availabilityForm.watch('dates');
  const nights = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;

  return (
    <div className="bg-background">
      <section className="relative py-24 md:py-32 bg-secondary/20">
         <div className="container max-w-7xl text-center">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="font-headline text-4xl md:text-6xl text-primary">Book Your Stay</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Choose your dates and find your perfect escape.
                </p>
            </MotionDiv>
        </div>
      </section>

      <section className="py-16 md:-mt-24 relative z-10">
        <div className="container max-w-5xl">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                <div className="bg-card border rounded-2xl p-4 md:p-6 shadow-xl">
                    <Form {...availabilityForm}>
                    <form onSubmit={availabilityForm.handleSubmit(onCheckAvailability)} className="grid md:grid-cols-12 gap-4 items-center">
                        
                        <div className="md:col-span-5">
                            <FormField
                            control={availabilityForm.control}
                            name="dates"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"ghost"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal h-16 text-base",
                                            !field.value?.from && "text-muted-foreground"
                                            )}
                                        >
                                            <div className="flex items-center w-full">
                                                <CalendarIcon className="mr-4 h-6 w-6 text-primary/70" />
                                                {!hasMounted ? (<div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium w-20 h-4 bg-muted-foreground/20 rounded-md animate-pulse"></p>
                                                    <p className="w-24 h-4 bg-muted-foreground/10 rounded-md animate-pulse"></p>
                                                </div>) :
                                                (<div className="flex-1">
                                                    <p className="text-sm font-medium">Check-in</p>
                                                    <p>{field.value?.from ? format(field.value.from, "LLL dd, y") : "Add date"}</p>
                                                </div>)}
                                                <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground"/>
                                                {!hasMounted ? (<div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium w-20 h-4 bg-muted-foreground/20 rounded-md animate-pulse"></p>
                                                    <p className="w-24 h-4 bg-muted-foreground/10 rounded-md animate-pulse"></p>
                                                </div>) :
                                                (<div className="flex-1">
                                                    <p className="text-sm font-medium">Check-out</p>
                                                    <p>{field.value?.to ? format(field.value.to, "LLL dd, y") : "Add date"}</p>
                                                </div>)}
                                            </div>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.value?.from}
                                        selected={field.value as DateRange}
                                        onSelect={field.onChange}
                                        numberOfMonths={2}
                                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="pl-4" />
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="md:col-span-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"ghost"} className="w-full justify-start text-left font-normal h-16 text-base">
                                         <Users className="mr-4 h-6 w-6 text-primary/70" />
                                         <div>
                                            <p className="text-sm font-medium">Guests</p>
                                            <p className="text-foreground">{totalGuests} guest{totalGuests > 1 ? 's' : ''}</p>
                                         </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Guests</h4>
                                        <p className="text-sm text-muted-foreground">
                                        How many people are coming?
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="adults">Adults</Label>
                                            <div className="flex items-center gap-2">
                                                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => availabilityForm.setValue('adults', Math.max(1, availabilityForm.getValues('adults') - 1))}><Minus className="h-4 w-4" /></Button>
                                                <Input id="adults" type="number" min="1" className="h-8 w-12 text-center" {...availabilityForm.register('adults')} />
                                                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => availabilityForm.setValue('adults', availabilityForm.getValues('adults') + 1)}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="children">Children</Label>
                                             <div className="flex items-center gap-2">
                                                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => availabilityForm.setValue('children', Math.max(0, availabilityForm.getValues('children') - 1))}><Minus className="h-4 w-4" /></Button>
                                                <Input id="children" type="number" min="0" className="h-8 w-12 text-center" {...availabilityForm.register('children')} />
                                                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => availabilityForm.setValue('children', availabilityForm.getValues('children') + 1)}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        
                        <div className="md:col-span-3">
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
                <MotionDiv 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h3 className="font-headline text-3xl text-primary">No Stays Available</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">Unfortunately, no stays match your criteria for the selected dates or guest count. Please try different dates or a smaller group.</p>
                    <Button variant="outline" className="mt-6" onClick={() => setSearchPerformed(false)}>Modify Search</Button>
                </MotionDiv>
            )}
            
            {!isLoading && availableStays.length > 0 && (
                 <div className="space-y-12">
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="font-headline text-center text-4xl md:text-5xl text-primary">Available Stays</h2>
                        <p className="mt-2 text-center text-muted-foreground">{dateRange?.from && format(dateRange.from, 'PPP')} - {dateRange?.to && format(dateRange.to, 'PPP')} ({nights} nights)</p>
                    </MotionDiv>
                    <div className="grid md:grid-cols-1 gap-8">
                        {availableStays.map((stay, index) => {
                             const image = PlaceHolderImages.find(img => img.id === stay.images[0]) || {imageUrl: `https://picsum.photos/seed/${stay.id}/800/600`, imageHint: stay.name, description: stay.name};
                             const totalPrice = nights * stay.price_per_night;
                            return (
                            <MotionDiv
                                key={stay.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="bg-card rounded-2xl border shadow-md overflow-hidden grid md:grid-cols-12 gap-0">
                                    <div className="md:col-span-5 relative">
                                        <Image
                                            src={image.imageUrl}
                                            alt={stay.name}
                                            width={800}
                                            height={600}
                                            className="object-cover w-full h-64 md:h-full"
                                            data-ai-hint={image.imageHint}
                                        />
                                    </div>
                                    <div className="md:col-span-7 p-6 md:p-8 flex flex-col">
                                         <h3 className="font-headline text-3xl text-primary">{stay.name}</h3>
                                         <p className="mt-2 text-muted-foreground flex-grow">{stay.short_description}</p>
                                        <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-2 text-primary/70" />
                                                <span>Up to {stay.max_guests} guests</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Bed className="h-4 w-4 mr-2 text-primary/70" />
                                                <span>Queen/King Bed</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t flex flex-col md:flex-row md:justify-between md:items-end">
                                            <div>
                                                 <p className="text-2xl font-bold text-foreground">
                                                    ${totalPrice.toLocaleString()}
                                                </p>
                                                <p className="text-sm font-normal text-muted-foreground">${stay.price_per_night}/night ({nights} nights)</p>
                                            </div>
                                            <Button size="lg" className="w-full md:w-auto mt-4 md:mt-0" onClick={() => handleBookNowClick(stay)}>Select Stay</Button>
                                        </div>
                                    </div>
                                </div>
                            </MotionDiv>
                        )})}
                    </div>
                </div>
            )}
        </div>
      </div>

       <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">Confirm Your Booking</DialogTitle>
            <DialogDescription>
                You're about to book the <strong>{selectedStay?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="bg-secondary/50 rounded-lg p-4 text-sm">
                <div className="flex justify-between"><span>Check-in:</span> <span className="font-medium">{bookingDetails?.dates.from && format(bookingDetails.dates.from, "PPP")}</span></div>
                <div className="flex justify-between"><span>Check-out:</span> <span className="font-medium">{bookingDetails?.dates.to && format(bookingDetails.dates.to, "PPP")}</span></div>
                <div className="flex justify-between mt-2 pt-2 border-t"><span>Guests:</span> <span className="font-medium">{bookingDetails?.adults} Adults, {bookingDetails?.children} Children</span></div>
             </div>

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
                    <Button type="submit" className="w-full" size="lg" disabled={bookingForm.formState.isSubmitting}>
                    {bookingForm.formState.isSubmitting ? "Submitting..." : "Submit Booking Request"}
                    </Button>
                </DialogFooter>
                </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
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
