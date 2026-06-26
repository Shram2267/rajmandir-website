import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Rajmandir Hypermarket",
  description:
    "How Rajmandir Hypermarket collects, uses, and protects the limited personal information shared through our website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <DocPage kicker="Aapki Niji Jaankari" title="Privacy Policy" updated="June 2026">
      <h2>1. Information we collect</h2>
      <p>
        This is primarily an informational website. We only collect personal information that you
        choose to share with us, such as:
      </p>
      <ul>
        <li>Your email address, if you subscribe to our offers newsletter.</li>
        <li>Details you submit through our feedback form.</li>
        <li>
          Your approximate location, only when you tap &quot;Use my location&quot; on the store
          locator — used solely to find your nearest store and never stored.
        </li>
      </ul>

      <h2>2. How we use it</h2>
      <p>
        We use the information to send you offer updates you asked for, respond to your feedback,
        and improve our stores and website. We do not sell your personal information.
      </p>

      <h2>3. Cookies and analytics</h2>
      <p>
        We may use basic cookies and aggregate analytics to understand how visitors use the site.
        These do not identify you personally. You can disable cookies in your browser settings.
      </p>

      <h2>4. Data sharing</h2>
      <p>
        We share information only with trusted service providers who help us operate the site (for
        example, email delivery), and only to the extent needed. We may disclose information if
        required by law.
      </p>

      <h2>5. Your choices</h2>
      <p>
        You can unsubscribe from our newsletter at any time using the link in our emails, or by
        contacting us. To request access to or deletion of your information, email{" "}
        <a href="mailto:rajmandir.care@gmail.com">rajmandir.care@gmail.com</a>.
      </p>

      <h2>6. Contact</h2>
      <p>
        For any privacy-related question, write to{" "}
        <a href="mailto:rajmandir.care@gmail.com">rajmandir.care@gmail.com</a> or call (+91)
        9311239211.
      </p>
    </DocPage>
  );
}
