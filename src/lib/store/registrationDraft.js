let draft = null;

export const setRegistrationDraft = (value) => {
  draft = value;
};

export const getRegistrationDraft = () => draft;

export const clearRegistrationDraft = () => {
  draft = null;
};