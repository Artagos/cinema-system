import { createContext, useContext, type ReactNode, type ChangeEvent } from 'react';
import type { MovieFormData } from '../../types/movie';

interface FormContextType {
  values: MovieFormData;
  errors: Partial<Record<keyof MovieFormData, string>>;
  touched: Partial<Record<keyof MovieFormData, boolean>>;
  setValue: <K extends keyof MovieFormData>(field: K, value: MovieFormData[K]) => void;
  getFieldProps: (field: keyof MovieFormData) => {
    id: string;
    name: string;
    value: unknown;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
  };
}

const FormContext = createContext<FormContextType | null>(null);

function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('MovieForm compound components must be used within MovieFormCompound');
  }
  return context;
}

interface MovieFormCompoundProps {
  children: ReactNode;
  values: MovieFormData;
  errors: Partial<Record<keyof MovieFormData, string>>;
  touched: Partial<Record<keyof MovieFormData, boolean>>;
  setValue: <K extends keyof MovieFormData>(field: K, value: MovieFormData[K]) => void;
  setTouched: (field: keyof MovieFormData) => void;
}

function MovieFormCompound({
  children,
  values,
  errors,
  touched,
  setValue,
  setTouched,
}: MovieFormCompoundProps) {
  const getFieldProps = (field: keyof MovieFormData) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setValue(field, value);
    },
    onBlur: () => setTouched(field),
  });

  return (
    <FormContext.Provider value={{ values, errors, touched, setValue, getFieldProps }}>
      {children}
    </FormContext.Provider>
  );
}

// Section Component
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="form-section">
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

// Form Row Component
function Row({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  const className = columns === 3 ? 'form-row three-col' : 'form-row';
  return <div className={className}>{children}</div>;
}

// Field Component with error handling
interface FieldProps {
  name: keyof MovieFormData;
  label: string;
  required?: boolean;
  children: (props: {
    id: string;
    name: string;
    value: unknown;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    hasError: boolean;
  }) => ReactNode;
}

function Field({ name, label, required, children }: FieldProps) {
  const { getFieldProps, errors, touched } = useFormContext();
  const props = getFieldProps(name);
  const hasError = !!errors[name] && !!touched[name];

  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {children({ ...props, hasError })}
      {hasError && <span className="field-error">{errors[name]}</span>}
    </div>
  );
}

// Text Input Component
function TextInput({
  name,
  label,
  required,
  placeholder,
  type = 'text',
}: {
  name: keyof MovieFormData;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'number' | 'date';
}) {
  return (
    <Field name={name} label={label} required={required}>
      {(props) => (
        <input
          type={type}
          {...props}
          value={props.value as string}
          placeholder={placeholder}
          className={props.hasError ? 'error' : ''}
        />
      )}
    </Field>
  );
}

// TextArea Component
function TextArea({
  name,
  label,
  required,
  placeholder,
  rows = 4,
}: {
  name: keyof MovieFormData;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Field name={name} label={label} required={required}>
      {(props) => (
        <textarea
          {...props}
          value={props.value as string}
          rows={rows}
          placeholder={placeholder}
          className={props.hasError ? 'error' : ''}
        />
      )}
    </Field>
  );
}

// Select Component
function Select({
  name,
  label,
  required,
  children: options,
}: {
  name: keyof MovieFormData;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <Field name={name} label={label} required={required}>
      {(props) => (
        <select {...props} value={props.value as string}>
          {options}
        </select>
      )}
    </Field>
  );
}

// Checkbox Group Component
interface CheckboxGroupProps {
  name: 'genre';
  label: string;
  required?: boolean;
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
}

function CheckboxGroup({ name, label, required, options, selected, onChange }: CheckboxGroupProps) {
  const { errors, touched } = useFormContext();
  const hasError = !!errors[name] && touched[name];

  return (
    <div className="form-field">
      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <div className={`genre-checkboxes ${hasError ? 'error' : ''}`}>
        {options.map((option) => (
          <label key={option} className="checkbox-label">
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              onChange={(e) => onChange(option, e.target.checked)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {hasError && <span className="field-error">{errors[name]}</span>}
    </div>
  );
}

// Poster Preview Component
function PosterPreview({ url }: { url?: string }) {
  if (!url) return null;

  return (
    <div className="poster-preview">
      <img
        src={url}
        alt="Poster preview"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

// Actions Component
function Actions({
  children,
  // submitting = false,
}: {
  children: ReactNode;
  submitting?: boolean;
}) {
  return (
    <div className="form-actions">
      {children}
    </div>
  );
}

// Attach sub-components
MovieFormCompound.Section = Section;
MovieFormCompound.Row = Row;
MovieFormCompound.Field = Field;
MovieFormCompound.TextInput = TextInput;
MovieFormCompound.TextArea = TextArea;
MovieFormCompound.Select = Select;
MovieFormCompound.CheckboxGroup = CheckboxGroup;
MovieFormCompound.PosterPreview = PosterPreview;
MovieFormCompound.Actions = Actions;

export { MovieFormCompound };
