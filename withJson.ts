export function withJson(body: any, status?: number): Response {
  const text = JSON.stringify(body);

  return new Response(text, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
