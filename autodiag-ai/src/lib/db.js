import { supabase, isSupabaseConfigured } from './supabaseClient'

// Abstraction de persistance.
// - Supabase si configuré (tables `vehicles` et `diagnostics`).
// - localStorage en mode démo.

const LS = {
  vehicles: 'autodiag.vehicles',
  diagnostics: 'autodiag.diagnostics',
  recent: 'autodiag.recent',
  guestCount: 'autodiag.guestDiagCount',
}

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

/* ----------------------------- Véhicules ----------------------------- */

export async function getVehicles(userId) {
  if (isSupabaseConfigured && userId) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return read(LS.vehicles)
}

export async function addVehicle(userId, vehicle) {
  if (isSupabaseConfigured && userId) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({ ...vehicle, user_id: userId })
      .select()
      .single()
    if (error) throw error
    return data
  }
  const list = read(LS.vehicles)
  const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...vehicle }
  write(LS.vehicles, [item, ...list])
  return item
}

export async function deleteVehicle(userId, id) {
  if (isSupabaseConfigured && userId) {
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) throw error
    return
  }
  write(LS.vehicles, read(LS.vehicles).filter((v) => v.id !== id))
}

/* ---------------------------- Diagnostics ---------------------------- */

export async function getDiagnostics(userId) {
  if (isSupabaseConfigured && userId) {
    const { data, error } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    if (error) throw error
    return data
  }
  return read(LS.diagnostics)
}

export async function addDiagnostic(userId, diag) {
  const payload = {
    symptome: diag.symptome,
    resultat: diag.resultat,
    vehicle_label: diag.vehicle_label || null,
    date: new Date().toISOString(),
  }
  if (isSupabaseConfigured && userId) {
    const { data, error } = await supabase
      .from('diagnostics')
      .insert({ ...payload, user_id: userId, vehicle_id: diag.vehicle_id || null })
      .select()
      .single()
    if (error) throw error
    return data
  }
  const list = read(LS.diagnostics)
  const item = { id: crypto.randomUUID(), ...payload }
  write(LS.diagnostics, [item, ...list])
  return item
}

/* ------------------- Véhicules consultés récemment ------------------- */

export function getRecent() {
  return read(LS.recent)
}
export function pushRecent(label) {
  const list = read(LS.recent).filter((x) => x !== label)
  write(LS.recent, [label, ...list].slice(0, 6))
}

/* ----------------- Quota de diagnostics (visiteur) ------------------- */

export const GUEST_LIMIT = 3
export function getGuestCount() {
  return Number(localStorage.getItem(LS.guestCount) || 0)
}
export function incGuestCount() {
  const n = getGuestCount() + 1
  localStorage.setItem(LS.guestCount, String(n))
  return n
}
