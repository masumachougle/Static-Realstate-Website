import { Card } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="pt-20">
      <div className="page-hero">
        <div className="page-container-wide page-hero-content-spacious">
          <div className="page-hero-text">
            <h1 className="page-hero-title font-semibold">Terms of Service</h1>
            <p className="page-hero-description">Last updated: November 2024</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the KSENZA Real Estate website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">2. Use of Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use our services in any way that violates applicable laws or regulations</li>
                <li>Transmit any harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Use our services for any fraudulent purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">3. Property Listings</h2>
              <p className="text-muted-foreground leading-relaxed">
                Property information provided on our website is for general information purposes only. While we strive to keep information accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, or availability of property listings. Property availability and prices are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The content on our website, including text, graphics, logos, images, and software, is the property of KSENZA Real Estate and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">5. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these third-party sites. Your use of third-party websites is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                KSENZA Real Estate shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. Our total liability shall not exceed the amount paid by you, if any, for accessing our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">7. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold KSENZA Real Estate harmless from any claims, damages, losses, liabilities, and expenses arising out of your use of our services or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Dubai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>KSENZA Real Estate</strong><br />
                Email: legal@ksenza.ae<br />
                Phone: +971 4 123 4567
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
