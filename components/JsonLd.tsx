/**
 * Renders a JSON-LD structured-data script tag.
 * Server-safe; pass any schema.org object (or array) as `data`.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is our own static/DB data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
