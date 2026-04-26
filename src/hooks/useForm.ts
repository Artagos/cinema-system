import {useState, useCallback, useRef, useMemo,} from 'react';

export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

export interface UseFormOptions<T extends object> {
  initialValues: T;
  validate?: (values: T) => FormErrors<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export interface UseFormResult<T extends object> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, message: string) => void;
  clearError: (field: keyof T) => void;
  reset: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e?: FormEvent) => Promise<void>;
  getFieldProps: (name: keyof T) => {
    name: keyof T;
    value: T[keyof T];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
}

/**
 * Headless Form Hook
 *
 * Separates form state management from UI presentation.
 * Consumer controls 100% of the UI.
 *
 * Usage:
 * const form = useForm({
 *   initialValues: { title: '', description: '' },
 *   validate: (values) => {
 *     const errors: FormErrors<typeof values> = {};
 *     if (!values.title) errors.title = 'Required';
 *     return errors;
 *   },
 *   onSubmit: async (values) => {
 *     await api.create(values);
 *   },
 * });
 *
 * <form onSubmit={form.handleSubmit}>
 *   <input {...form.getFieldProps('title')} />
 *   {form.errors.title && <span>{form.errors.title}</span>}
 *   <button type="submit" disabled={!form.isValid || form.isSubmitting}>
 *     Submit
 *   </button>
 * </form>
 */
export function useForm<T extends object>(
  options: UseFormOptions<T>
): UseFormResult<T> {
  const { initialValues, validate, onSubmit } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);

    const isDirty = useMemo(
        () => JSON.stringify(values) !== JSON.stringify(initialValuesRef.current),
        [values]
    );

  const runValidation = useCallback(
    (vals: T): FormErrors<T> => {
      if (!validate) return {};
      return validate(vals) || {};
    },
    [validate]
  );

  const isValid = Object.keys(runValidation(values)).length === 0;

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((prev) => {
      const next = { ...prev, [field]: value };
      // Re-validate on change if field is touched
      if (touched[field] && validate) {
        const newErrors = validate(next);
        setErrors(newErrors);
      }
      return next;
    });
  }, [touched, validate]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => {
      const next = { ...prev, ...newValues };
      if (validate) {
        const newErrors = validate(next);
        setErrors(newErrors);
      }
      return next;
    });
  }, [validate]);

  const setError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;

      let parsedValue: unknown = value;

      // Handle different input types
      if (type === 'number') {
        parsedValue = value === '' ? '' : Number(value);
      } else if (type === 'checkbox') {
        parsedValue = (e.target as HTMLInputElement).checked;
      }

      setValue(fieldName, parsedValue as T[typeof fieldName]);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      const fieldName = name as keyof T;

      setTouched((prev) => ({ ...prev, [fieldName]: true }));

      // Validate on blur
      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (e?: FormDataEvent) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as FormTouched<T>);
      setTouched(allTouched);

      // Validate all fields
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
    }),
    [values, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setValues,
    setError,
    clearError,
    reset,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
  };
}

export default useForm;
