// Shared text-style definitions for pamphlet text blocks (admin + public).

export type TextStyle = "h1" | "h2" | "h3" | "body";

export const TEXT_STYLE_OPTIONS: { value: TextStyle; label: string }[] = [
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "body", label: "Normal text" },
];

// Tailwind classes for each style — used to preview in the editor and to render
// on the public page.
export function textStyleClass(style: TextStyle | undefined): string {
  switch (style) {
    case "h1":
      return "text-[28px] lg:text-[40px] font-extrabold tracking-tight leading-tight text-ink";
    case "h2":
      return "text-[22px] lg:text-[30px] font-bold tracking-tight leading-tight text-ink";
    case "h3":
      return "text-[18px] lg:text-[22px] font-bold leading-snug text-ink";
    default:
      return "text-[15px] lg:text-[17px] leading-relaxed text-ink";
  }
}

// The semantic HTML tag used on the public page for each style.
export function textStyleTag(style: TextStyle | undefined): "h2" | "h3" | "h4" | "p" {
  switch (style) {
    case "h1":
      return "h2";
    case "h2":
      return "h3";
    case "h3":
      return "h4";
    default:
      return "p";
  }
}
