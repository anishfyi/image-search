import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useSearch } from '../../context/SearchContext';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

const SearchFilters: React.FC = () => {
  const { filters, setFilters } = useSearch();

  const sizeOptions: FilterOption[] = [
    { label: 'Any size', value: 'any' },
    { label: 'Large', value: 'large' },
    { label: 'Medium', value: 'medium' },
    { label: 'Icon', value: 'icon' },
  ];

  const colorOptions: FilterOption[] = [
    { label: 'Any color', value: 'any' },
    { label: 'Color', value: 'color' },
    { label: 'Black and white', value: 'gray' },
    { label: 'Transparent', value: 'trans' },
  ];

  const typeOptions: FilterOption[] = [
    { label: 'Any type', value: 'any' },
    { label: 'Photo', value: 'photo' },
    { label: 'Clip art', value: 'clipart' },
    { label: 'Line drawing', value: 'lineart' },
  ];

  const timeOptions: FilterOption[] = [
    { label: 'Any time', value: 'any' },
    { label: 'Past 24 hours', value: 'day' },
    { label: 'Past week', value: 'week' },
    { label: 'Past month', value: 'month' },
    { label: 'Past year', value: 'year' },
  ];

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const FilterDropdown: React.FC<FilterGroup> = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-neutral-text hover:bg-neutral-hover rounded"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span>{label}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-border z-10">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm ${
                  value === option.value
                    ? 'text-primary-blue bg-blue-50'
                    : 'text-neutral-text hover:bg-neutral-hover'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 border-b border-neutral-border">
      <FilterDropdown
        label="Size"
        options={sizeOptions}
        value={filters.size}
        onChange={(value) => handleFilterChange('size', value)}
      />
      <FilterDropdown
        label="Color"
        options={colorOptions}
        value={filters.color}
        onChange={(value) => handleFilterChange('color', value)}
      />
      <FilterDropdown
        label="Type"
        options={typeOptions}
        value={filters.type}
        onChange={(value) => handleFilterChange('type', value)}
      />
      <FilterDropdown
        label="Time"
        options={timeOptions}
        value={filters.time}
        onChange={(value) => handleFilterChange('time', value)}
      />
    </div>
  );
};

export default SearchFilters; 