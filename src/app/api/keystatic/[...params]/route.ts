import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// Handler tworzony leniwie (przy żądaniu), nie przy ładowaniu modułu — inaczej
// w trybie github build/deploy padałby bez kluczy GitHub (KEYSTATIC_*). Dzięki
// temu build nigdy nie zależy od tych kluczy; panel działa po ich ustawieniu.
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  return makeRouteHandler({ config }).GET(req);
}

export async function POST(req: Request): Promise<Response> {
  return makeRouteHandler({ config }).POST(req);
}
