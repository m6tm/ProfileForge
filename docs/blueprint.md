# **App Name**: ProfileForge

## Core Features:

- AuthN/AuthZ: Secure user login and registration using NextAuth.js.
- Profile Display: Display personal profile details, including editable data fields.
- Profile Editing: Enable users to modify their contact information, preferences, and other data fields.
- AI-Enhanced Suggestions: AI-powered tool that can analyze user-inputted information to provide a summary, suggest relevant fields for modification, or flag potentially sensitive data.
- API Interaction: Persist profile updates to an external, secured API using appropriate security protocols.
- Field validation: Visually indicate mandatory vs optional form fields

## Style Guidelines:

- Background color: Very light cool gray (#FBFBFC) creating a clean and modern backdrop, based on the defined --background CSS variable, suggesting a subtle, non-distracting base.
- Primary color: Muted, yet noticeable desaturated orange color (#AC7617). As set in the OKLCH definition of the --primary css variable, and converted to HEX.
- Accent color: Soft lavender (#E0E1EC), is defined in the user provided theme using --accent css variable. This color provides contrast with primary without clashing.
- Body and headline font: 'Inter', a sans-serif font, offers a clean and modern feel suitable for a user profile management portal. Note: currently only Google Fonts are supported.
- Monospace font: 'Source Code Pro' for code snippets or displaying technical information within the profile. Note: currently only Google Fonts are supported.
- Use a set of consistent, minimalist icons to represent different profile sections and actions, complementing the modern UI.
- Employ a clean, single-page layout with clear section divisions to ensure easy navigation and access to profile information.
- Incorporate subtle animations for loading states and transitions, enhancing user experience and interface responsiveness.