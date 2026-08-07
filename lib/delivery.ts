export const deliveryStorageKey = "hazel-special-delivery";
export const deliveryReplayWindowMs = 25 * 60 * 60 * 1000;

export const deliveryAssets = {
  introVideo: "/delivery/videos/delivery-intro.mp4",
  coffeeVideo: "/delivery/videos/hazelnut-coffee.mp4",
  backgroundMusic: "/delivery/music/background.mp3"
};

export type DeliveryState = {
  completed: boolean;
  completedAt: number;
};

export function parseDeliveryState(value: string | null): DeliveryState | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<DeliveryState>;
    if (parsed.completed !== true || typeof parsed.completedAt !== "number") {
      return null;
    }
    return { completed: true, completedAt: parsed.completedAt };
  } catch {
    return null;
  }
  
}

export function isDeliveryAvailable(state: DeliveryState | null, now = Date.now()) {
  if (!state?.completed) return true;
  return now - state.completedAt < deliveryReplayWindowMs;
}
