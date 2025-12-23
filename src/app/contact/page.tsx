import { BookingEnquiry } from "@/components/booking-enquiry";
import { PageHeader } from "@/components/page-header";

export default function ContactPage() {
    return (
        <>
            <PageHeader 
                title="Get in Touch"
                description="We’d love to help you plan your stay. Reach out with any questions or for assistance with your booking."
            />
            <BookingEnquiry />
        </>
    );
}
