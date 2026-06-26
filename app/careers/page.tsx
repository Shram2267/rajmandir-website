import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Careers | Rajmandir Hypermarket",
  description:
    "Join the Rajmandir Hypermarket family. Explore retail, store operations, and support roles across our Delhi NCR stores.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <DocPage kicker="Hamari Team Join Karein" title="Build your career with Rajmandir">
      <p>
        Rajmandir Hypermarket is one of Delhi NCR&apos;s fastest-growing retail chains, and we are
        always looking for energetic, customer-first people to grow with us. Whether you are starting
        out or have years of retail experience, there&apos;s a place for you on our team.
      </p>

      <h2>Areas we hire for</h2>
      <ul>
        <li>Store operations — cashiers, floor staff, and department in-charges</li>
        <li>Inventory &amp; supply chain</li>
        <li>Customer service</li>
        <li>Visual merchandising &amp; marketing</li>
        <li>Accounts, HR, and administration</li>
      </ul>

      <h2>Why work with us</h2>
      <ul>
        <li>Stable, growing company with 100+ store vision across India</li>
        <li>On-the-job training and clear paths to promotion</li>
        <li>Friendly, family-like work culture</li>
        <li>Employee discounts at our stores</li>
      </ul>

      <h2>How to apply</h2>
      <p>
        Send your CV and the role you&apos;re interested in to{" "}
        <a href="mailto:rajmandir.care@gmail.com?subject=Job%20Application">
          rajmandir.care@gmail.com
        </a>{" "}
        with the subject line &quot;Job Application&quot;. You can also walk in to any of our stores
        and speak with the store manager.
      </p>
      <p>
        Not sure which role fits?{" "}
        <Link href="/contact">Get in touch</Link> and we&apos;ll point you in the right direction.
      </p>
    </DocPage>
  );
}
