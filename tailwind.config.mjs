/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'primary': '#e00700',
                'background-light': '#f8f5f5',
                'background-dark': '#181110',
                'card-dark': '#231515',
                'border-dark': '#3a2727',
                'text-muted': '#bc9b9a',
            },
            fontFamily: {
                'display': ['Spline Sans', 'sans-serif'],
                'body': ['Noto Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
