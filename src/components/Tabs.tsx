import { useState } from 'react';
import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  number: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultActive?: string;
}

export function Tabs({ items, defaultActive }: TabsProps) {
  const [active, setActive] = useState<string>(defaultActive ?? items[0]?.id);
  const activeItem = items.find((i) => i.id === active);

  return (
    <>
      <div className="tabs">
        {items.map((item) => (
          <button
            key={item.id}
            className={`tab ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="n">{item.number}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="panel" key={active}>
        {activeItem?.content}
      </div>
    </>
  );
}