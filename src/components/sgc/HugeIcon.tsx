"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export function HugeIcon({
  icon,
  className,
  size = 18,
}: {
  icon: IconSvgElement;
  className?: string;
  size?: number;
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={1.8}
      className={className}
    />
  );
}
