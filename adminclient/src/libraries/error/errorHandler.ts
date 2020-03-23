const getErrorMessage = (error: Error | null): string => {
  if (!Boolean(error.message)) {
    return "";
  }

  if (Boolean(/<message>(.*)/gi.exec(error.message))) {
    return /<message>(.*)/gi.exec(error.message)[1].trim();
  }

  if (Boolean(/GraphQL error:(.*)/gi.exec(error.message))) {
    return /GraphQL error:(.*)/gi.exec(error.message)[1].trim();
  }

  return error.message || "";
};

export const errorHandler = {
  getErrorMessage,
};
