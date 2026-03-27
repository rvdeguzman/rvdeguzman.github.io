"use client";

import { PS2Orbs } from "./PS2Orbs";

export default function TextModelCanvas() {
  return (
    <div className="flex h-full w-full min-h-0 items-center justify-center">
      <div className="aspect-square h-full w-full overflow-hidden rounded-xl bg-black">
        <PS2Orbs
          mode="ascii"
          resolution={1}
          orbSize={1.6}
          palette={{
            fg: "#ffffff",
            core: "#ffffff",
            shell: "#f6f8ff",
            halo: "#8ea3df",
            trail: "#4d68b5",
          }}
        />
      </div>
    </div>
  );
}
