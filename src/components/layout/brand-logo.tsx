import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
}

export function BrandLogo({ className, imageClassName }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white px-1",
        className,
      )}
    >
      <Image
        src="/alpha-tutor-mark.png"
        alt="Alpha Tutor"
        width={512}
        height={512}
        className={cn("h-12 w-auto object-contain sm:h-14", imageClassName)}
        priority
      />
    </span>
  );
}
