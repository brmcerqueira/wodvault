globalThis.hostApi = Deno.env.get("HOST_API") ?? "https://wodvault.wod.deno.net"

await import("./start.ts");