import { PageHeader } from "@/components/page-header";

export default function TermsAndConditionsPage() {
    return (
        <div>
            <PageHeader title="Terms & Conditions" />
            <div className="container max-w-4xl py-16 prose prose-lg prose-p:text-muted-foreground/90 prose-h2:font-headline prose-h2:text-primary prose-h2:text-3xl">
                <p className="text-sm text-muted-foreground">Last updated: July 2024</p>

                <h2>Introduction</h2>
                <p>
                    Welcome to Glampify. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Glampify if you do not agree to all of the terms and conditions stated on this page.
                </p>

                <h2>Bookings and Payments</h2>
                <p>
                    All booking enquiries are subject to availability and confirmation. A booking is considered confirmed only after you receive a booking confirmation email from us. Full payment is required at the time of booking unless otherwise specified.
                </p>

                <h2>Guest Responsibilities</h2>
                <p>
                    Guests are expected to treat the property and its amenities with care. Any damage to the property caused by a guest may result in charges for repair or replacement. Guests must adhere to the maximum occupancy limits for their booked stay.
                </p>

                <h2>Check-in and Check-out</h2>
                <p>
                    Check-in time is 3:00 PM. Check-out time is 11:00 AM. Early check-in or late check-out may be available upon request and is subject to availability and additional fees.
                </p>
                
                <h2>Limitation of Liability</h2>
                <p>
                    Glampify is not liable for any personal injuries, property damage, or other losses that may occur during your stay. We encourage all guests to secure their own travel insurance.
                </p>

                <h2>Changes to Terms</h2>
                <p>
                    We reserve the right to amend these terms and conditions at any time. Any such changes will be effective immediately upon posting on the website.
                </p>

                <h2>Contact Us</h2>
                <p>If you have any questions about these Terms & Conditions, please contact us.</p>
            </div>
        </div>
    );
}
