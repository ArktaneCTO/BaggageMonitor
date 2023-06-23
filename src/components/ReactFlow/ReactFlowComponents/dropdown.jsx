import React, { useState, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import CheckboxGroup from 'react-checkbox-group';

const DropdownWithCheckbox = ({ options,SelectedOptions, onChange }) => {
//   const [selectedOptions, setSelectedOptions] = useState(SelectedOptions);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionChange = (newSelectedOptions) => {
    //setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownHide = () => {
    setIsOpen(false);
  };

  const handleParentOptionChange = (Option, isChecked) => {
    let newSelectedOptions = [...SelectedOptions];

    if (isChecked) {

      newSelectedOptions = Array.from(new Set([...newSelectedOptions, Option,]));
    } else {

      newSelectedOptions = newSelectedOptions.filter(
        (option) => option !== Option 
      );
    }

    // setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };


  const renderOptions = (options) => {
    return (
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {options.map((option) => (
          <li key={option.value}>
            {option.children ? (
              <>
                {option.label}
                <ul>{renderOptions(option.children)}</ul>
              </>
            ) : (
              <label>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={SelectedOptions.includes(option.value)}
                  onChange={(e) => handleParentOptionChange(option.value, e.target.checked)}
                />
                {option.label}
              </label>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div ref={dropdownRef}>
      <Dropdown 
       id="1"
       size="sm"
       tag="label"
      show={isOpen} onToggle={handleDropdownToggle} onHide={handleDropdownHide}>
        <Dropdown.Toggle variant="primary" className='bg-dark' id="dropdown-toggle" 
       style={{ "color": "#9a9a9a",
        borderColor: "#344675",
        background: "transparent"}}>
          Select Routes
        </Dropdown.Toggle>
        <Dropdown.Menu className='bg-dark d-flex align-items-center justify-content-center'>
          <CheckboxGroup name="options" value={SelectedOptions} onChange={handleOptionChange}>
            {(Checkbox) => renderOptions(options)}
          </CheckboxGroup>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropdownWithCheckbox;
