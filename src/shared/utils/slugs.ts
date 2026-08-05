import slugify from "slugify";

export function generateSlug(value: string): string {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function generateSlugWithSuffix(slug: string): string {
  const suffix = Math.random()
    .toString(36)
    .substring(2, 6);

  return `${slug}-${suffix}`;
}