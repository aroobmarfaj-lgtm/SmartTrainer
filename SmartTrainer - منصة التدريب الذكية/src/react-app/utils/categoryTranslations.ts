// Category name mappings for translation
export const categoryNameMap: Record<string, string> = {
  'الرياضيات': 'category.math',
  'العلوم': 'category.science',
  'اللغة العربية': 'category.arabic',
  'التاريخ': 'category.history',
  'الجغرافيا': 'category.geography',
};

// Category description mappings for translation
export const categoryDescMap: Record<string, string> = {
  'أسئلة في الجبر والهندسة والحساب': 'category.math.desc',
  'أسئلة في الفيزياء والكيمياء والأحياء': 'category.science.desc',
  'أسئلة في النحو والصرف والأدب': 'category.arabic.desc',
  'أسئلة في التاريخ الإسلامي والعربي': 'category.history.desc',
  'أسئلة في جغرافية العالم والوطن العربي': 'category.geography.desc',
};

// Function to get translated category name
export function getTranslatedCategoryName(originalName: string, t: (key: string) => string): string {
  // Check if we have a translation key for this Arabic name
  const translationKey = categoryNameMap[originalName];
  if (translationKey) {
    // Get the translated value using the translation function
    const translatedValue = t(translationKey);
    // Return the translated value if it exists
    return translatedValue || originalName;
  }
  // Return original name if no translation mapping exists
  return originalName;
}

// Function to get translated category description
export function getTranslatedCategoryDescription(originalDesc: string | null, t: (key: string) => string): string | null {
  if (!originalDesc) return null;
  
  // Check if we have a translation key for this Arabic description
  const translationKey = categoryDescMap[originalDesc];
  if (translationKey) {
    // Get the translated value using the translation function
    const translatedValue = t(translationKey);
    // Return the translated value if it exists
    return translatedValue || originalDesc;
  }
  // Return original description if no translation mapping exists
  return originalDesc;
}
