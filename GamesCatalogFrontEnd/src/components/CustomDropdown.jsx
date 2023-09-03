import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';

/**
 * CustomDropdown is a reusable component that allows users to select options from a dropdown menu.
 *
 * @param {Array} options - An array of available options.
 * @param {Array} selectedOptions - An array of currently selected options.
 * @param {Function} onOptionToggle - A callback function called when an option is toggled.
 * @returns {JSX.Element} - The rendered dropdown component.
 */
const CustomDropdown = ({ options, selectedOptions, onOptionToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  //Handles toggling the dropdown menu's visibility.
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handles toggling an option's selection.
   *
   * @param {string} option - The option to toggle.
   */
  const handleOptionToggle = (option) => {
    onOptionToggle(option);
  };

  /**
   * Handles clicks outside the dropdown to close it.
   *
   * @param {MouseEvent} event - The click event.
   */
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <Dropdown show={isOpen} onToggle={handleToggle}>
        <Dropdown.Toggle variant="secondary" id="dropdown-custom">
          Select Options
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => (
            <Dropdown.Item
              key={option}
              active={selectedOptions.includes(option)}
              onClick={() => handleOptionToggle(option)}
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {selectedOptions.length > 0 && (
        <div className="selected-options">
          Selected options: {selectedOptions.join(', ')}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
