"use client";

import { useMemo, useRef, useState } from "react";
import {
  uploadPamphletImage,
  savePamphletPage,
  type Block,
  type ImageItem,
} from "./actions";
import { TEXT_STYLE_OPTIONS, textStyleClass, type TextStyle } from "@/lib/pamphletText";

type PageRow = { zone: string; blocks: Block[] };

const MAX_COLS = 4;

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `b_${Date.now()}_${Math.random().toString(36).slice(2)}`;

function makeBlock(type: "text" | "images"): Block {
  return type === "text"
    ? { id: newId(), type: "text", text: "", style: "body" }
    : { id: newId(), type: "images", cols: 2, items: [null, null] };
}

export default function PamphletsAdminClient({
  zones,
  pages,
}: {
  zones: string[];
  pages: PageRow[];
}) {
  const pageMap = useMemo(() => {
    const m: Record<string, PageRow> = {};
    for (const p of pages) m[p.zone] = p;
    return m;
  }, [pages]);

  const [selectedZone, setSelectedZone] = useState(zones[0] || "");
  const [blocks, setBlocks] = useState<Block[]>(pageMap[zones[0] || ""]?.blocks ?? []);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [openInserter, setOpenInserter] = useState<number | null>(null); // insert index whose menu is open
  const [busySlot, setBusySlot] = useState<string | null>(null); // `${blockId}-${idx}`

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingTarget = useRef<{ blockId: string; idx: number } | null>(null);

  // ---- zone switching ------------------------------------------------------
  const loadZone = (zone: string) => {
    if (zone === selectedZone) return;
    if (dirty && !confirm("You have unsaved changes. Discard them?")) return;
    setSelectedZone(zone);
    setBlocks(pageMap[zone]?.blocks ?? []);
    setOpenInserter(null);
    setDirty(false);
    setSavedAt(null);
  };

  const touch = () => setDirty(true);

  // ---- block operations ----------------------------------------------------
  const insertBlock = (index: number, type: "text" | "images") => {
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(index, 0, makeBlock(type));
      return next;
    });
    setOpenInserter(null);
    touch();
  };

  const updateBlock = (id: string, updater: (b: Block) => Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? updater(b) : b)));
    touch();
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    touch();
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    touch();
  };

  const setCols = (id: string, cols: number) => {
    const c = Math.max(1, Math.min(MAX_COLS, cols));
    updateBlock(id, (b) => {
      if (b.type !== "images") return b;
      const items = [...b.items];
      while (items.length < c) items.push(null);
      return { ...b, cols: c, items: items.slice(0, c) };
    });
  };

  // ---- image upload --------------------------------------------------------
  const triggerImage = (blockId: string, idx: number) => {
    pendingTarget.current = { blockId, idx };
    fileInputRef.current?.click();
  };

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = pendingTarget.current;
    if (!file || !target) return;
    const slotKey = `${target.blockId}-${target.idx}`;
    setBusySlot(slotKey);

    const fd = new FormData();
    fd.append("zone", selectedZone);
    fd.append("file", file);
    const res = await uploadPamphletImage(fd);

    setBusySlot(null);
    if (res?.success && res.url) {
      const item: ImageItem = { url: res.url, fileName: res.fileName };
      updateBlock(target.blockId, (b) => {
        if (b.type !== "images") return b;
        const items = [...b.items];
        items[target.idx] = item;
        return { ...b, items };
      });
    } else if (res?.error) {
      alert(res.error);
    }
    e.target.value = "";
    pendingTarget.current = null;
  };

  const clearSlot = (blockId: string, idx: number) =>
    updateBlock(blockId, (b) => {
      if (b.type !== "images") return b;
      const items = [...b.items];
      items[idx] = null;
      return { ...b, items };
    });

  // ---- save ----------------------------------------------------------------
  const save = async () => {
    if (!selectedZone) return;
    setSaving(true);
    const res = await savePamphletPage(selectedZone, blocks);
    setSaving(false);
    if (res?.success) {
      setDirty(false);
      setSavedAt(new Date().toLocaleTimeString());
    } else if (res?.error) {
      alert(res.error);
    }
  };

  return (
    <div className="p-8">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onFilePicked}
      />

      {/* header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-ink">Manage Pamphlet Offers</h1>
          <p className="text-stone-500 mt-1">
            Add text and image blocks in any order. Drag-free — use the arrows to reorder.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          {savedAt && !dirty && (
            <span className="text-xs text-leaf-deep font-semibold">✓ Saved {savedAt}</span>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty || !selectedZone}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2 ${
              saving || !dirty || !selectedZone
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : "bg-brand text-white hover:bg-brand-deep cursor-pointer"
            }`}
          >
            {saving ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Saving...
              </>
            ) : dirty ? (
              "Save changes"
            ) : (
              "Saved"
            )}
          </button>
        </div>
      </div>

      {/* zone pills */}
      <div className="flex flex-wrap gap-2 pb-4">
        {zones.map((z) => {
          const active = z === selectedZone;
          const hasContent = (pageMap[z]?.blocks?.length ?? 0) > 0;
          return (
            <button
              key={z}
              type="button"
              onClick={() => loadZone(z)}
              className={`text-[13px] font-bold px-[18px] py-[8px] rounded-[24px] transition-colors border cursor-pointer ${
                active
                  ? "bg-brand border-brand text-white"
                  : "bg-white border-line text-stone-600 hover:text-ink hover:border-stone-400 shadow-sm"
              }`}
            >
              {z}
              {hasContent && (
                <span
                  className={`ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle ${active ? "bg-white" : "bg-leaf"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* builder */}
      <div className="bg-white rounded-xl border border-line shadow-sm p-5">
        <h2 className="text-sm font-bold text-ink mb-2">
          {selectedZone || "Select a zone"}
          <span className="ml-2 font-medium text-stone-400">
            {blocks.length} block{blocks.length === 1 ? "" : "s"}
          </span>
        </h2>

        <Inserter
          open={openInserter === 0}
          onToggle={() => setOpenInserter(openInserter === 0 ? null : 0)}
          onPick={(t) => insertBlock(0, t)}
          onClose={() => setOpenInserter(null)}
        />

        {blocks.map((block, i) => (
          <div key={block.id}>
            <BlockCard
              block={block}
              index={i}
              total={blocks.length}
              busySlot={busySlot}
              onMove={(dir) => moveBlock(block.id, dir)}
              onDelete={() => deleteBlock(block.id)}
              onTextChange={(text) =>
                updateBlock(block.id, (b) => (b.type === "text" ? { ...b, text } : b))
              }
              onStyleChange={(style) =>
                updateBlock(block.id, (b) => (b.type === "text" ? { ...b, style } : b))
              }
              onCols={(c) => setCols(block.id, c)}
              onAddImage={(idx) => triggerImage(block.id, idx)}
              onClearImage={(idx) => clearSlot(block.id, idx)}
            />
            <Inserter
              open={openInserter === i + 1}
              onToggle={() => setOpenInserter(openInserter === i + 1 ? null : i + 1)}
              onPick={(t) => insertBlock(i + 1, t)}
              onClose={() => setOpenInserter(null)}
            />
          </div>
        ))}

        {blocks.length === 0 && (
          <p className="text-center text-stone-400 text-sm py-6">
            Empty page — use <span className="font-bold text-brand">+ Add block</span> above to start.
          </p>
        )}
      </div>
    </div>
  );
}

// --- An "+ Add block" row that expands to a Text / Images picker ------------
function Inserter({
  open,
  onToggle,
  onPick,
  onClose,
}: {
  open: boolean;
  onToggle: () => void;
  onPick: (type: "text" | "images") => void;
  onClose: () => void;
}) {
  return (
    <div className="relative flex items-center justify-center my-2">
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
      <button
        onClick={onToggle}
        className="relative z-10 px-3 py-1 rounded-full bg-white border border-line text-xs font-bold text-stone-500 hover:text-brand hover:border-brand transition-colors shadow-sm"
      >
        + Add block
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={onClose} />
          <div className="absolute z-30 top-full mt-2 bg-white rounded-xl border border-line shadow-xl p-1.5 flex gap-1">
            <button
              onClick={() => onPick("text")}
              className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <span className="text-brand text-lg font-extrabold leading-none">Tt</span>
              <span className="text-[11px] font-semibold text-stone-600">Text box</span>
            </button>
            <button
              onClick={() => onPick("images")}
              className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <span className="text-lg leading-none">🖼️</span>
              <span className="text-[11px] font-semibold text-stone-600">Images</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// --- One block (text or images row) ----------------------------------------
function BlockCard({
  block,
  index,
  total,
  busySlot,
  onMove,
  onDelete,
  onTextChange,
  onStyleChange,
  onCols,
  onAddImage,
  onClearImage,
}: {
  block: Block;
  index: number;
  total: number;
  busySlot: string | null;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  onTextChange: (text: string) => void;
  onStyleChange: (style: TextStyle) => void;
  onCols: (cols: number) => void;
  onAddImage: (idx: number) => void;
  onClearImage: (idx: number) => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-stone-50/40 p-3">
      {/* toolbar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-stone-400">
            {block.type === "text" ? "Text" : "Images"}
          </span>
          {block.type === "text" && (
            <select
              value={block.style ?? "body"}
              onChange={(e) => onStyleChange(e.target.value as TextStyle)}
              className="text-xs font-semibold text-stone-600 bg-white border border-line rounded-md px-2 py-1 focus:ring-1 focus:ring-brand focus:border-brand outline-none cursor-pointer"
            >
              {TEXT_STYLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            ↑
          </IconBtn>
          <IconBtn label="Move down" disabled={index === total - 1} onClick={() => onMove(1)}>
            ↓
          </IconBtn>
          <IconBtn label="Delete block" danger onClick={onDelete}>
            ✕
          </IconBtn>
        </div>
      </div>

      {block.type === "text" ? (
        <textarea
          value={block.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={block.style && block.style !== "body" ? "Type heading here…" : "Type text here…"}
          className={`w-full min-h-[80px] resize-y rounded-md border border-line bg-white p-3 focus:ring-1 focus:ring-brand focus:border-brand outline-none ${textStyleClass(block.style)}`}
        />
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-stone-500">Images side by side:</span>
            <div className="flex items-center border border-line rounded-md overflow-hidden bg-white">
              <button
                onClick={() => onCols(block.cols - 1)}
                disabled={block.cols <= 1}
                className={`w-7 h-7 text-base font-bold ${block.cols <= 1 ? "text-stone-300" : "text-stone-600 hover:bg-stone-100"}`}
              >
                −
              </button>
              <span className="w-7 text-center text-sm font-bold tabular-nums">{block.cols}</span>
              <button
                onClick={() => onCols(block.cols + 1)}
                disabled={block.cols >= MAX_COLS}
                className={`w-7 h-7 text-base font-bold ${block.cols >= MAX_COLS ? "text-stone-300" : "text-stone-600 hover:bg-stone-100"}`}
              >
                +
              </button>
            </div>
          </div>

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${block.cols}, minmax(0, 1fr))` }}
          >
            {block.items.map((item, idx) => {
              const busy = busySlot === `${block.id}-${idx}`;
              return (
                <div
                  key={idx}
                  className="relative min-h-[150px] rounded-lg border-2 border-dashed border-line bg-white flex items-center justify-center overflow-hidden"
                >
                  {busy ? (
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-stone-300 border-t-brand rounded-full" />
                  ) : item ? (
                    <div className="group relative w-full h-full p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.fileName || "Pamphlet image"}
                        className="w-full h-full object-contain max-h-[240px]"
                      />
                      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => onAddImage(idx)}
                          className="px-3 py-1.5 rounded-md bg-white text-xs font-bold text-ink hover:bg-stone-100"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => onClearImage(idx)}
                          className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs font-bold hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddImage(idx)}
                      title="Add image"
                      className="w-12 h-12 rounded-full bg-white border border-line shadow-sm flex items-center justify-center text-2xl leading-none text-stone-500 hover:text-brand hover:border-brand transition-colors"
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`w-7 h-7 rounded-md text-sm font-bold flex items-center justify-center transition-colors ${
        disabled
          ? "text-stone-300 cursor-not-allowed"
          : danger
            ? "text-red-500 hover:bg-red-50"
            : "text-stone-500 hover:bg-stone-100"
      }`}
    >
      {children}
    </button>
  );
}
