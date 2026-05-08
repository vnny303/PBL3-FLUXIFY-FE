import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Premium Select Component
 * @param {Object} props
 * @param {any} props.value - Current selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of { value, label } or simple values
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional classes for the trigger
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Disabled state
 */
export function Select({ 
    value, 
    onChange, 
    options = [], 
    placeholder = 'Select option...', 
    className = '',
    error = '',
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Normalize options to { value, label }
    const normalizedOptions = options.map(opt => {
        if (typeof opt === 'object' && opt !== null) {
            return {
                value: opt.value !== undefined ? opt.value : opt.id || opt.categoryId,
                label: opt.label || opt.name || opt.text
            };
        }
        return { value: opt, label: opt };
    });

    const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        if (disabled) return;
        onChange({ target: { value: val } }); // Simulate event object
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full px-4 py-2.5 
                    bg-white border rounded-xl text-sm transition-all duration-200
                    ${isOpen ? 'ring-2 ring-black/5 border-black' : 'border-[#e3e3e3] hover:border-slate-400'}
                    ${error ? 'border-red-500 bg-red-50/30' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer'}
                    ${className}
                `}
                disabled={disabled}
            >
                <span className={`truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-900 font-medium'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown 
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-white border border-[#e3e3e3] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200">
                        {normalizedOptions.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-slate-400 italic">No options available</div>
                        ) : (
                            normalizedOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        flex items-center justify-between w-full px-4 py-2 text-sm text-left
                                        transition-colors duration-150
                                        ${String(option.value) === String(value) 
                                            ? 'bg-slate-100 text-black font-semibold' 
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-black'}
                                    `}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {String(option.value) === String(value) && (
                                        <Check className="w-4 h-4 text-black shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
            
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
