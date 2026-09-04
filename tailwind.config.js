import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                "label-lg": ["inter"], "label-sm": ["inter"], "body-lg": ["inter"], 
                "headline-lg": ["plusJakartaSans"], "headline-sm": ["plusJakartaSans"], 
                "headline-xl": ["plusJakartaSans"], "body-md": ["inter"], 
                "display-hero": ["plusJakartaSans"], "display-hero-mobile": ["plusJakartaSans"], 
                "body-sm": ["inter"], "headline-md": ["plusJakartaSans"], 
                "headline-xl-mobile": ["plusJakartaSans"], "label-md": ["inter"]
            },
            colors: {
                "on-error": "#690005", "primary-fixed": "#ffdad5", "on-primary-fixed-variant": "#930007", 
                "surface-container-high": "#2a2a2c", "surface-tint": "#ffb4aa", "on-background": "#e5e1e4", 
                "on-tertiary": "#003061", "tertiary-fixed": "#d5e3ff", "primary-container": "#e50914", 
                "on-surface": "#e5e1e4", "secondary-container": "#ee9800", "surface-container-low": "#1c1b1d", 
                "surface-bright": "#39393b", "outline": "#af8782", "background": "#131315", 
                "on-surface-variant": "#e9bcb6", "surface-container-highest": "#353437", "on-primary": "#690003", 
                "tertiary": "#a7c8ff", "inverse-surface": "#e5e1e4", "primary-fixed-dim": "#ffb4aa", 
                "on-primary-fixed": "#410001", "inverse-on-surface": "#313032", "inverse-primary": "#c0000c", 
                "on-tertiary-container": "#f8f9ff", "on-secondary-fixed-variant": "#653e00", "on-error-container": "#ffdad6", 
                "surface": "#131315", "surface-container-lowest": "#0e0e10", "outline-variant": "#5e3f3b", 
                "error-container": "#93000a", "tertiary-container": "#0072d7", "on-secondary-fixed": "#2a1700", 
                "on-tertiary-fixed-variant": "#004689", "surface-variant": "#353437", "on-secondary-container": "#5b3800", 
                "secondary": "#ffb95f", "secondary-fixed": "#ffddb8", "on-primary-container": "#fff7f6", 
                "error": "#ffb4ab", "tertiary-fixed-dim": "#a7c8ff", "on-tertiary-fixed": "#001b3c", 
                "surface-dim": "#131315", "primary": "#ffb4aa", "on-secondary": "#472a00", 
                "surface-container": "#201f22", "secondary-fixed-dim": "#ffb95f"
            },
            spacing: {
                "space-md": "1rem", "margin-desktop": "3.5rem", "space-2xs": "0.25rem", "margin-mobile": "1rem", 
                "space-xs": "0.5rem", "space-3xl": "4.5rem", "space-sm": "0.75rem", "space-lg": "1.5rem", 
                "gutter-desktop": "1.5rem", "space-xl": "2rem", "space-2xl": "3rem", "gutter-mobile": "0.75rem", 
                "gutter-tablet": "1rem"
            },
            borderRadius: { 
                "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" 
            },
            fontSize: { 
                "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "600" }], 
                "label-sm": ["11px", { "lineHeight": "14px", "letterSpacing": "0.04em", "fontWeight": "700" }], 
                "body-lg": ["16px", { "lineHeight": "26px", "letterSpacing": "-0.005em", "fontWeight": "400" }], 
                "headline-lg": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.015em", "fontWeight": "700" }], 
                "headline-sm": ["18px", { "lineHeight": "26px", "letterSpacing": "0em", "fontWeight": "600" }], 
                "headline-xl": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700" }], 
                "body-md": ["14px", { "lineHeight": "22px", "letterSpacing": "0em", "fontWeight": "400" }], 
                "display-hero": ["56px", { "lineHeight": "64px", "letterSpacing": "-0.03em", "fontWeight": "800" }], 
                "display-hero-mobile": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "800" }], 
                "body-sm": ["12px", { "lineHeight": "18px", "letterSpacing": "0.01em", "fontWeight": "400" }], 
                "headline-md": ["22px", { "lineHeight": "30px", "letterSpacing": "-0.01em", "fontWeight": "600" }], 
                "headline-xl-mobile": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.01em", "fontWeight": "700" }], 
                "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600" }] 
            }
        },
    },

    plugins: [forms],
};
