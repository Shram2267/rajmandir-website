import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Terms of Service | Rajmandir Hypermarket",
  description:
    "Terms of Service governing the use of the Rajmandir Hypermarket website and the offers shown on it.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <DocPage kicker="Niyam aur Shartein" title="Terms of Service" updated="June 2026">
      <h2>1. About this website</h2>
      <p>
        This website is operated by Rajmandir Hypermarket to showcase our stores, today&apos;s
        in-store offers, and pamphlet deals. By browsing the site you agree to these terms. If you
        do not agree, please discontinue use of the site.
      </p>

      <h2>2. Offers and pricing</h2>
      <p>
        Offers, prices, and product availability shown on this website are for information only and
        are subject to change without notice. Prices may vary by store, and stock is limited and
        available on a first-come, first-served basis while supplies last. The price charged at the
        store billing counter is final.
      </p>
      <ul>
        <li>All offers are valid only at the physical store and for the period stated in-store.</li>
        <li>We reserve the right to limit quantities per customer.</li>
        <li>Product images and icons are indicative and may differ from the actual item.</li>
      </ul>

      <h2>3. No online sale</h2>
      <p>
        This website does not currently process online orders or payments. All purchases are made
        in person at a Rajmandir Hypermarket store.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        The Rajmandir Hypermarket name, logo, and all content on this site are the property of
        Rajmandir Hypermarket and may not be reproduced without written permission.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        While we make every effort to keep information accurate and up to date, the site is provided
        &quot;as is&quot;. Rajmandir Hypermarket is not liable for any loss arising from reliance on
        information published here, including outdated offers or pricing errors.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:rajmandir.care@gmail.com">rajmandir.care@gmail.com</a> or call (+91)
        9311239211.
      </p>
    </DocPage>
  );
}
