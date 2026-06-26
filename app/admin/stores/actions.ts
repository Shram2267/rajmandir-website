"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addStore(formData: FormData) {
  const supabase = await createClient();

  const phone = formData.get("phone") as string;
  const manager = formData.get("manager") as string;
  const lat = formData.get("lat") as string;
  const lng = formData.get("lng") as string;

  const whatsapp = formData.get("whatsapp") as string;

  const store: Record<string, unknown> = {
    n: String(Date.now()),
    name: formData.get("name") as string,
    area: formData.get("area") as string,
    addr: formData.get("addr") as string,
    pin_code: formData.get("pin_code") as string,
    hours: (formData.get("hours") as string) || "Open 10 AM to 10 PM Daily",
    short_name: formData.get("short_name") as string,
    phone: phone || "",
    lat: lat ? parseFloat(lat) : 0,
    lng: lng ? parseFloat(lng) : 0,
  };

  if (manager) store.manager = manager;
  if (whatsapp) store.whatsapp = whatsapp;

  const { error } = await supabase.from("stores").insert(store);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/stores");
  revalidatePath("/stores");
}

export async function editStore(id: number, data: Record<string, unknown>) {
  const supabase = await createClient();

  const { error } = await supabase.from("stores").update(data).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/stores");
  revalidatePath("/stores");
}

export async function deleteStore(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("stores").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/stores");
  revalidatePath("/stores");
}

export async function bulkDeleteStores(ids: number[]) {
  const supabase = await createClient();

  const { error } = await supabase.from("stores").delete().in("id", ids);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/stores");
  revalidatePath("/stores");
}

export async function bulkUploadStores(stores: Array<Record<string, unknown>>) {
  const supabase = await createClient();

  const { error } = await supabase.from("stores").insert(stores);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/stores");
  revalidatePath("/stores");
}
