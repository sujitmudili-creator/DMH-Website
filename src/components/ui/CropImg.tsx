import type { CSSProperties } from "react";

/** Image box as placed in Figma: the image is offset and scaled inside a clipped frame (percentages of the frame). */
export type Crop = { left: string; top: string; width: string; height: string };

type Props = {
  src: string;
  crop?: Crop;
  alt?: string;
  className?: string;
  imgClassName?: string;
};

export function CropImg({ src, crop, alt = "", className = "", imgClassName = "" }: Props) {
  // Keep the caller's absolute/fixed positioning; otherwise the frame is the positioning context.
  const position = /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? "" : "relative";
  if (!crop) {
    return (
      <div className={`${position} overflow-hidden ${className}`}>
        <img src={src} alt={alt} className={`absolute inset-0 size-full object-cover ${imgClassName}`} />
      </div>
    );
  }
  const style: CSSProperties = { left: crop.left, top: crop.top, width: crop.width, height: crop.height };
  return (
    <div className={`${position} overflow-hidden ${className}`}>
      <img src={src} alt={alt} style={style} className={`absolute max-w-none ${imgClassName}`} />
    </div>
  );
}
