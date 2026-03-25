import { useState, useEffect, useRef } from 'preact/hooks';

export function ContextMenu() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      let x = e.clientX;
      let y = e.clientY;

      // Show first to measure, then adjust
      setVisible(true);
      setPos({ x, y });

      requestAnimationFrame(() => {
        if (!menuRef.current) return;
        const rect = menuRef.current.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width;
        if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height;
        setPos({ x, y });
      });
    };

    const onClick = () => setVisible(false);

    document.addEventListener('contextmenu', onContext);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('click', onClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <ul
      ref={menuRef}
      class="vista-context-menu"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    >
      <li onClick={() => window.history.back()}>
        <span class="ctx-icon">&#9664;</span> Back
      </li>
      <li onClick={() => window.history.forward()}>
        <span class="ctx-icon">&#9654;</span> Forward
      </li>
      <li onClick={() => window.location.reload()}>
        <span class="ctx-icon">&#8635;</span> Refresh
      </li>
      <li class="ctx-sep" />
      <li onClick={() => {
        const sel = window.getSelection()?.toString();
        if (sel) navigator.clipboard.writeText(sel);
      }}>
        <span class="ctx-icon">&#128203;</span> Copy
      </li>
      <li onClick={() => window.getSelection()?.selectAllChildren(document.body)}>
        <span class="ctx-icon">&#9744;</span> Select All
      </li>
      <li class="ctx-sep" />
      <li onClick={() => window.print()}>
        <span class="ctx-icon">&#128424;</span> Print...
      </li>
    </ul>
  );
}
