export function vapid(
  env: Env,
): JsonWebKey {
  return JSON.parse(env.VAPID_PRIVATE_KEY);
}
