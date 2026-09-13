import * as T from "three";

/** Add a gentle viewer-facing head lift without altering the rig's body motion. */
export function withEmoteGaze(source: T.AnimationClip, drinking = false) {
  const clip = source.clone();
  const head = clip.tracks.find((track) => track.name === "head.quaternion");
  if (!head) return clip;
  const sample = new T.QuaternionLinearInterpolant(head.times, head.values, 4);
  const rotation = new T.Quaternion();
  const lift = new T.Quaternion();
  const times: number[] = [];
  const values: number[] = [];
  const frames = Math.ceil(clip.duration * 30);
  for (let frame = 0; frame <= frames; frame++) {
    const time = (frame / frames) * clip.duration;
    const envelope =
      T.MathUtils.smootherstep(time, 0, 0.25) *
      (1 - T.MathUtils.smootherstep(time, clip.duration - 0.3, clip.duration));
    // Keep the carefully aligned mouth-to-rim pose during the actual sip.
    const sip = drinking
      ? T.MathUtils.smootherstep(time, 0.8, 1.65) *
        (1 - T.MathUtils.smootherstep(time, 2.85, 3.65))
      : 0;
    const angle =
      (drinking ? T.MathUtils.lerp(0.25, 0.035, sip) : 0.32) * envelope;
    rotation.fromArray(sample.evaluate(time));
    lift.setFromAxisAngle(new T.Vector3(1, 0, 0), -angle);
    rotation.multiply(lift).normalize();
    times.push(time);
    values.push(...rotation.toArray());
  }
  clip.tracks = clip.tracks.map((track) =>
    track === head
      ? new T.QuaternionKeyframeTrack(head.name, times, values)
      : track,
  );
  return clip;
}
