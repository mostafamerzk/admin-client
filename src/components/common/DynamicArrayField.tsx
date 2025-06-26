/**
 * Dynamic Array Field Component
 * 
 * A reusable component for managing arrays of objects with add/remove/edit functionality.
 * Used for product attributes, variants, and other dynamic form sections.
 */


import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import FormField from './FormField';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface DynamicArrayFieldProps<T> {
  label: string;
  value: T[];
  onChange: (value: T[]) => void;
  fieldConfigs: FieldConfig[];
  createEmpty: () => T;
  error?: string | undefined;
  disabled?: boolean;
  maxItems?: number;
  className?: string;
  itemLabel?: (item: T, index: number) => string;
}

function DynamicArrayField<T extends Record<string, any>>({
  label,
  value,
  onChange,
  fieldConfigs,
  createEmpty,
  error,
  disabled = false,
  maxItems = 20,
  className = '',
  itemLabel
}: DynamicArrayFieldProps<T>) {
  const handleAdd = () => {
    if (value.length < maxItems) {
      onChange([...value, createEmpty()]);
    }
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleItemChange = (index: number, field: string, fieldValue: any) => {
    const newValue = value.map((item, i) => 
      i === index ? { ...item, [field]: fieldValue } : item
    );
    onChange(newValue);
  };

  const getDefaultItemLabel = (item: T, index: number): string => {
    if (itemLabel) {
      return itemLabel(item, index);
    }
    
    // Try to find a name or title field
    const nameField = item.name || item.title || item.label;
    if (nameField) {
      return nameField;
    }
    
    return `Item ${index + 1}`;
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="text-xs text-gray-500 ml-2">
            ({value.length}/{maxItems} items)
          </span>
        </label>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled || value.length >= maxItems}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          Add {label.slice(0, -1)} {/* Remove 's' from plural label */}
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="space-y-4">
        {value.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">
                {getDefaultItemLabel(item, index)}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                icon={<XMarkIcon className="w-4 h-4" />}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldConfigs.map((config) => {
                const fieldProps: any = {
                  label: config.label,
                  name: `${config.name}_${index}`,
                  type: config.type,
                  value: item[config.name] || '',
                  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                    const fieldValue = config.type === 'number'
                      ? parseFloat(e.target.value) || 0
                      : e.target.value;
                    handleItemChange(index, config.name, fieldValue);
                  },
                  required: config.required || false,
                  placeholder: config.placeholder || '',
                  disabled: disabled,
                  className: config.type === 'textarea' ? 'md:col-span-2' : ''
                };

                // Only add options if they exist
                if (config.options) {
                  fieldProps.options = config.options;
                }

                return <FormField key={config.name} {...fieldProps} />;
              })}
            </div>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No {label.toLowerCase()} added yet.</p>
            <p className="text-xs mt-1">Click "Add {label.slice(0, -1)}" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DynamicArrayField;
