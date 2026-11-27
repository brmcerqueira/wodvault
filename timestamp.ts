let offset = 0;

export async function clockAdjust() {
  if (offset == 0) {
    const beforeTime = Date.now();

    const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace");

    const text = await response.text();
    const match = text.match(/^ts=(.+)$/m);

    const datetime = match ? new Date(Number(match[1]) * 1000) : new Date();

    const afterTime = Date.now();

    offset = datetime.getTime() + ((afterTime - beforeTime) / 2) - afterTime;
  }
}

export function timestamp(): number {
  return Date.now() + offset;
}
