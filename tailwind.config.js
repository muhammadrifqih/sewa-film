import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
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
                "primary": "rgb(var(--color-primary) / <alpha-value>)",
                "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
                "primary-container": "rgb(var(--color-primary-container) / <alpha-value>)",
                "on-primary-container": "rgb(var(--color-on-primary-container) / <alpha-value>)",
                "primary-fixed-dim": "rgb(var(--color-primary-fixed-dim) / <alpha-value>)",
                "secondary": "rgb(var(--color-secondary) / <alpha-value>)",
                "on-secondary": "rgb(var(--color-on-secondary) / <alpha-value>)",
                "error": "rgb(var(--color-error) / <alpha-value>)",
                "on-error": "rgb(var(--color-on-error) / <alpha-value>)",
                "success": "rgb(var(--color-success) / <alpha-value>)",
                "background": "rgb(var(--color-background) / <alpha-value>)",
                "on-background": "rgb(var(--color-on-background) / <alpha-value>)",
                "surface": "rgb(var(--color-surface) / <alpha-value>)",
                "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
                "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
                "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
                "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
                "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
                "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
                "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
                "outline": "rgb(var(--color-outline) / <alpha-value>)",
                "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
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
