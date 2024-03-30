function validate({ username, password, email, phone }, path) {
  const errors = [];
  const validationFields = [];

  if (path === 'login') {
    validationFields.push({ field: 'Username', value: username });
    validationFields.push({ field: 'Password', value: password });
  } else {
    validationFields.push({ field: 'Username', value: username });
    validationFields.push({ field: 'Password', value: password });
    validationFields.push({ field: 'Email', value: email });
    validationFields.push({ field: 'Phone', value: phone });
  }

  validationFields.forEach(({ field, value }) => {
    if (!value) {
      errors.push(`${field} is required`);
    } else {
      if (field === 'Email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);
        if (!isValidEmail) {
          errors.push('Invalid email');
        }
      }
      if (field === 'Phone') {
        const phoneRegex = /^\d{10}$/;
        const sanitizedPhoneNumber = String(value).trim();
        if (sanitizedPhoneNumber.length !== 10) {
          errors.push(`Phone number must be 10 digits long`);
        } else {
          const isValidPhoneNumber = phoneRegex.test(sanitizedPhoneNumber);
          if (!isValidPhoneNumber) {
            errors.push(`Invalid phone number ${sanitizedPhoneNumber}`);
          }
        }
      }
      if (field === 'Username') {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        const isValidUsername = usernameRegex.test(value);
        if (!isValidUsername) {
          errors.push(
            'Invalid username, can use _ and alphanumeric characters only'
          );
        }
      }
      if (field === 'Password') {
        const passwordRegex = /^\S+$/;
        const isValidPassword = passwordRegex.test(value);
        if (!isValidPassword) {
          errors.push('Invalid password, must not contain spaces');
        }
      }
    }
  });
  return errors;
}

export { validate };
