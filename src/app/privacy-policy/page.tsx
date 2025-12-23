import { PageHeader } from "@/components/page-header";

export default function PrivacyPolicyPage() {
    return (
        <div>
            <PageHeader title="Privacy Policy" />
            <div className="container max-w-4xl py-16 prose prose-lg prose-p:text-muted-foreground/90 prose-h2:font-headline prose-h2:text-primary prose-h2:text-3xl">
                <p className="text-sm text-muted-foreground">Last updated: July 2024</p>
                
                <h2>Introduction</h2>
                <p>
                    Glampify ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>

                <h2>Information We Collect</h2>
                <p>
                    We may collect personal information from you in a variety of ways, including when you make a booking enquiry, contact us with questions, or subscribe to our newsletter. The types of personal information we may collect include:
                </p>
                <ul>
                    <li>Your name, email address, and phone number.</li>
                    <li>Booking information, such as your desired dates and number of guests.</li>
                    <li>Any other information you voluntarily provide to us in your communications.</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>
                    We use the information we collect to:
                </p>
                <ul>
                    <li>Process and manage your booking enquiries and reservations.</li>
                    <li>Communicate with you about your stay.</li>
                    <li>Respond to your questions and comments.</li>
                    <li>Send you marketing communications, if you have opted in to receive them.</li>
                    <li>Improve our website and services.</li>
                </ul>

                <h2>Information Sharing</h2>
                <p>
                    We do not sell, trade, or otherwise transfer your personal information to outside parties, except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                </p>
                
                <h2>Data Security</h2>
                <p>
                    We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                </p>

                <h2>Your Rights</h2>
                <p>
                    You have the right to access, correct, or delete your personal information. You may also opt-out of receiving marketing communications from us at any time.
                </p>

                <h2>Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us using the information on our contact page.</p>
            </div>
        </div>
    );
}
