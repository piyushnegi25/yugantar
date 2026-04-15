export const UPLOAD_LIMITS = {
  maxFiles: 8,
  maxFileSizeBytes: 5 * 1024 * 1024,
  allowedMimeTypes: new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]),
};

export function validateImageFiles(files: File[]) {
  if (!files.length) {
    return { valid: false, error: "At least one image is required" };
  }

  if (files.length > UPLOAD_LIMITS.maxFiles) {
    return {
      valid: false,
      error: `Too many files. Maximum ${UPLOAD_LIMITS.maxFiles} images allowed`,
    };
  }

  for (const file of files) {
    if (!file || file.size <= 0) {
      return { valid: false, error: "Invalid image file detected" };
    }

    if (file.size > UPLOAD_LIMITS.maxFileSizeBytes) {
      return {
        valid: false,
        error: `Image \"${file.name}\" exceeds 5MB size limit`,
      };
    }

    if (!UPLOAD_LIMITS.allowedMimeTypes.has(file.type)) {
      return {
        valid: false,
        error: `Unsupported file type for \"${file.name}\"`,
      };
    }
  }

  return { valid: true, error: null };
}
