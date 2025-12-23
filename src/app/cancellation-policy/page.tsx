import { PageHeader } from "@/components/page-header";

export default function CancellationPolicyPage() {
    return (
        <div>
            <PageHeader title="Cancellation Policy" />
            <div className="container max-w-4xl py-16 prose prose-lg prose-p:text-muted-foreground/90 prose-h2:font-headline prose-h2:text-primary prose-h2:text-3xl">
                <p className="text-sm text-muted-foreground">Last updated: July 2024</p>
                
                <p>
                    We understand that plans can change. Our cancellation policy is designed to be as fair as possible while protecting our ability to operate. Please read it carefully before booking.
                </p>

                <h2>Standard Cancellation</h2>
                <p>
                    <strong>Full Refund:</strong> Cancellations made within 48 hours of booking receive a full refund, provided the check-in date is at least 14 days away.
                </p>
                <p>
                    <strong>50% Refund:</strong> Cancellations made at least 30 days before check-in will receive a 50% refund of the total booking amount.
                </p>
                <p>
                    <strong>No Refund:</strong> Cancellations made within 30 days of the check-in date are not eligible for a refund. We recommend purchasing travel insurance to cover unforeseen circumstances.
                </p>

                <h2>How to Cancel</h2>
                <p>
                    To cancel your booking, please reply to your confirmation email or contact us directly through our website's contact form. Please include your booking reference number. Cancellations are not considered confirmed until you receive a confirmation email from our team.
                </p>

                <h2>Non-Refundable Bookings</h2>
                <p>
                    Certain promotional offers may be non-refundable. This will be clearly stated at the time of booking. Non-refundable bookings are not eligible for any refund regardless of the cancellation date.
                </p>

                <h2>Modifications</h2>
                <p>
                    We may be able to accommodate date changes, subject to availability and potential rate differences. Modification requests must be made at least 30 days prior to your original check-in date.
                </p>

                <h2>Contact Us</h2>
                <p>If you have any questions about our cancellation policy, please contact us before making a reservation.</p>
            </div>
        </div>
    );
}
