import { useState, useEffect } from 'react';

/* 
  Hook for both login and register auth handling.
  Handles front end error validation
  Takes in state object, a function for validating email and passwords,
  and a function that calls register or login to 
  firebase auth depending on user selected form 
 */

function useFormValidation(initialState, validate, firebaseCall) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        firebaseCall();
        // console.log('communicating with firebase', values);
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  }, [errors, isSubmitting, firebaseCall]);

  function handleChange(event) {
    event.persist();
    setValues((previousValues) => ({
      ...previousValues,
      [event.target.name]: event.target.value,
    }));
  }

  function handleBlur() {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
  }

  function clearValues() {
    setValues(initialState);
  }

  function clearErrors() {
    setErrors({});
  }

  return {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    values,
    clearValues,
    clearErrors,
  };
}

export default useFormValidation;
