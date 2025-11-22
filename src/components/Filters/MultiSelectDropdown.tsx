import React, { useState, useRef, useEffect, memo } from 'react';
import styles from '../../styles/MultiSelectDropdown.module.scss';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
}

const MultiSelectDropdownComponent: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button 
        className={styles.dropdownTrigger} 
        onClick={handleToggle}
        type="button"
      >
        <span>
          {label}
          {selected.length > 0 && (
            <span className={styles.badge}>{selected.length}</span>
          )}
        </span>
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <div
                key={option}
                className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                onClick={() => onChange(option)}
              >
                <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`} />
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MultiSelectDropdown = memo(MultiSelectDropdownComponent);
