import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Rajmandir Hypermarket",
  description:
    "Rajmandir Hypermarket's in-store return, exchange, and refund policy for groceries and household products.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <DocPage kicker="Aasaan Wapsi" title="Return & Refund Policy" updated="June 2026">
      <p>
        We want you to be happy with every purchase. If something isn&apos;t right, our store teams
        are here to help. All returns and exchanges are handled in person at any Rajmandir
        Hypermarket store.
      </p>

      <h2>Returns within 7 days</h2>
      <p>
        Unopened, non-perishable products may be returned or exchanged within <strong>7 days</strong>{" "}
        of purchase, along with the original bill and packaging.
      </p>

      <h2>Perishable items</h2>
      <p>
        Fresh produce, dairy, frozen, and other perishable goods can only be returned on the{" "}
        <strong>same day</strong> of purchase if there is a genuine quality issue. Please bring the
        item and your bill to the store as soon as possible.
      </p>

      <h2>Non-returnable items</h2>
      <ul>
        <li>Products without the original purchase bill.</li>
        <li>Items marked &quot;no exchange&quot; at the time of sale.</li>
        <li>Personal care items that have been opened or used, for hygiene reasons.</li>
        <li>Products damaged due to misuse after purchase.</li>
      </ul>

      <h2>Refunds</h2>
      <p>
        Approved refunds are issued through the original payment method. Cash purchases are refunded
        in cash at the store; card and UPI payments are credited back to the same account, which may
        take a few business days depending on your bank.
      </p>

      <h2>Need help?</h2>
      <p>
        Visit your nearest store, email{" "}
        <a href="mailto:rajmandir.care@gmail.com">rajmandir.care@gmail.com</a>, or call (+91)
        9311239211 and our team will assist you.
      </p>
    </DocPage>
  );
}
