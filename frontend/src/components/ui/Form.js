import { Formik, Form, useField  } from 'formik';

function FormWrapper({ initialValues, validationSchema, onSubmit, children, className }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className={className}>
        {children}
      </Form>
    </Formik>
  );
}

function FormField({ label, name, type = 'text', className = '',disabled=false }) {
  const [field, meta] = useField(name);

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-dark mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        {...field}
        id={name}
        type={type}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
}

export {
    FormWrapper,
    FormField
}