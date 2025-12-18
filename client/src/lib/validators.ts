// Validation error type
export type ValidationError = string | null;

// Generic field validators
export const isRequired = (
  value: string,
  fieldName: string
): ValidationError => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const minLength = (
  value: string,
  min: number,
  fieldName: string
): ValidationError => {
  if (value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

// Date validators
export const isDateInFuture = (dateString: string): ValidationError => {
  const date = new Date(dateString);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (date > today) {
    return "Date cannot be in the future";
  }
  return null;
};

export const isDateInPast = (dateString: string): ValidationError => {
  const date = new Date(dateString);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return "Date cannot be in the past";
  }
  return null;
};

export const isDateTooOld = (
  dateString: string,
  maxYearsAgo: number
): ValidationError => {
  const date = new Date(dateString);
  const threshold = new Date();
  threshold.setFullYear(threshold.getFullYear() - maxYearsAgo);

  if (date < threshold) {
    return `Date cannot be more than ${maxYearsAgo} years ago`;
  }
  return null;
};

export const isDateTooFarInFuture = (
  dateString: string,
  maxYearsAhead: number
): ValidationError => {
  const date = new Date(dateString);
  const threshold = new Date();
  threshold.setFullYear(threshold.getFullYear() + maxYearsAhead);

  if (date > threshold) {
    return `Date cannot be more than ${maxYearsAhead} years in the future`;
  }
  return null;
};

export const isExpirationAfterAdministration = (
  adminDateString: string,
  expDateString: string
): ValidationError => {
  const adminDate = new Date(adminDateString);
  const expDate = new Date(expDateString);
  adminDate.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);

  if (expDate <= adminDate) {
    return "Expiration date must be after administration date";
  }
  return null;
};

export const isValidVaccinationPeriod = (
  adminDateString: string,
  expDateString: string,
  minDays: number = 1,
  maxDays: number = 3650 // 10 years
): ValidationError => {
  const adminDate = new Date(adminDateString);
  const expDate = new Date(expDateString);
  adminDate.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);

  const timeDiff = expDate.getTime() - adminDate.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  if (daysDiff < minDays) {
    return "Vaccination period seems too short";
  }

  if (daysDiff > maxDays) {
    const years = Math.floor(maxDays / 365);
    return `Vaccination period seems unusually long (more than ${years} years)`;
  }

  return null;
};

interface VaccinationFormData {
  name: string;
  administeredAt: string;
  expiresAt: string;
}

export const validateVaccineForm = (
  formData: VaccinationFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate name
  const nameError = isRequired(formData.name, "Vaccine name");
  if (nameError) errors.name = nameError;

  // Validate administration date
  if (!formData.administeredAt) {
    errors.administeredAt = "Administration date is required";
  } else {
    const futureError = isDateInFuture(formData.administeredAt);
    if (futureError) {
      errors.administeredAt = futureError;
    } else {
      const tooOldError = isDateTooOld(formData.administeredAt, 20);
      if (tooOldError) errors.administeredAt = tooOldError;
    }
  }

  // Validate expiration date
  if (!formData.expiresAt) {
    errors.expiresAt = "Expiration date is required";
  } else {
    const tooFarError = isDateTooFarInFuture(formData.expiresAt, 10);
    if (tooFarError) errors.expiresAt = tooFarError;
  }

  // Cross-field validation
  if (
    formData.administeredAt &&
    formData.expiresAt &&
    !errors.administeredAt &&
    !errors.expiresAt
  ) {
    const orderError = isExpirationAfterAdministration(
      formData.administeredAt,
      formData.expiresAt
    );
    if (orderError) {
      errors.expiresAt = orderError;
    } else {
      const periodError = isValidVaccinationPeriod(
        formData.administeredAt,
        formData.expiresAt
      );
      if (periodError) errors.expiresAt = periodError;
    }
  }

  return errors;
};

// Allergy form validation
export interface AllergyFormData {
  reactions: string;
  severity: string;
}

export const validateAllergyForm = (
  formData: AllergyFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate reactions
  const reactionsRequiredError = isRequired(
    formData.reactions,
    "Allergic reactions description"
  );
  if (reactionsRequiredError) {
    errors.reactions = reactionsRequiredError;
  } else {
    const minLengthError = minLength(
      formData.reactions,
      3,
      "Allergic reactions description"
    );
    if (minLengthError) errors.reactions = minLengthError;
  }

  // Validate severity
  const severityError = isRequired(formData.severity, "Severity level");
  if (severityError) errors.severity = severityError;

  return errors;
};
