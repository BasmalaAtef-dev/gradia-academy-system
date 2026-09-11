import { useEffect, useRef, useState } from 'react';
import './Dropdown.css';

export function Dropdown({ trigger, children, align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <span onClick={() => setIsOpen((v) => !v)}>{trigger}</span>
      {isOpen && (
        <div className="dropdown__menu" style={{ [align]: 0 }} onClick={() => setIsOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, danger = false, ...rest }) {
  return (
    <button className={`dropdown__item ${danger ? 'dropdown__item--danger' : ''}`} {...rest}>
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="dropdown__divider" />;
}
