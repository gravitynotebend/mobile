/** Платформенные константы для iOS. */
export const Fonts = {
  /** iOS `UIFontDescriptorSystemDesignDefault` */
  sans: 'system-ui',
  /** iOS `UIFontDescriptorSystemDesignSerif` */
  serif: 'ui-serif',
  /** iOS `UIFontDescriptorSystemDesignRounded` */
  rounded: 'ui-rounded',
  /** iOS `UIFontDescriptorSystemDesignMonospaced` */
  mono: 'ui-monospace',
} as const;

export const BottomTabInset = 50;

/** На iOS поднимаем поле ввода над клавиатурой отступом. */
export const KeyboardBehavior: 'padding' | 'height' | 'position' | undefined = 'padding';
