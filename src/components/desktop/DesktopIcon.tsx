import { useRef } from "preact/hooks";

interface Props {
  icon: string;
  label: string;
  onOpen: () => void;
}

export function DesktopIcon({ icon, label, onOpen }: Props) {
  const clickTimer = useRef<number | null>(null);

  const handleClick = () => {
    if (clickTimer.current) {
      // Double click
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onOpen();
    } else {
      clickTimer.current = window.setTimeout(() => {
        clickTimer.current = null;
      }, 300);
    }
  };

  return (
    <div
      class="flex flex-col items-center w-[68px] p-1 cursor-pointer select-none text-center"
      onClick={handleClick}
      onDblClick={onOpen}
    >
      <span class="text-[32px] leading-none drop-shadow-sm">{icon}</span>
      <span class="text-[11px] text-white mt-1 px-1 leading-tight break-words"
        style={{ textShadow: "1px 1px 1px #000" }}
      >
        {label}
      </span>
    </div>
  );
}
