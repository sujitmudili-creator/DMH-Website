import { CropImg } from "@/components/ui/CropImg";
import { partners } from "@/data/home";

/** Partner hospital logos. `height` 52 on Home, 28 in the footer; widths scale with it. */
export function PartnerLogos({ height, className = "" }: { height: number; className?: string }) {
  const scale = height / 52;
  return (
    <div className={`flex items-center ${className}`}>
      {partners.map((p) => (
        <div key={p.name} style={{ width: Math.round(p.w * scale), height }} className="shrink-0">
          <CropImg src={p.src} alt={p.name} crop={p.crop} className="size-full" imgClassName={p.crop ? "" : "!object-contain"} />
        </div>
      ))}
    </div>
  );
}
