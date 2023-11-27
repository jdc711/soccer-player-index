import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="dropbtn">{title}</button>
            {isOpen && (
                <div className="dropdown-content">
                    {children}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
