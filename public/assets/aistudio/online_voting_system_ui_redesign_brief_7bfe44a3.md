# UI Modernisation Brief — Existing Online Voting System

## Objective

Modify the **existing online voting system application** to give its user interface the clean, polished, restrained visual style of the supplied EFCC recruitment-page screenshot, adapted to a **green-led visual identity** suitable for an online voting platform.

**This is a UI redesign of the existing project, not a request to create a new application.** First inspect the current codebase and understand its routes, components, data flow, authentication, voting process, and existing functionality. Then improve the UI in place while preserving the application’s current architecture and behaviour.

## Reference style

Use the uploaded EFCC screenshot as a visual reference for its overall design language:

- Clean, modern, professional, and credible.
- Strong, flat red panels in the reference translated into **flat green panels** for this project.
- Clear typography, generous whitespace, disciplined alignment, and simple rectangular cards.
- Restrained borders and shadows; no decorative effects that make the page look glossy or artificially generated.
- A strong hero section, clear navigation, concise information cards, orderly content sections, and a substantial footer.
- Consistent spacing and sizing throughout the page.
- A deliberate, human-designed appearance rather than a generic AI landing-page template.

Use the reference as inspiration for layout and visual restraint, not as content to copy. Do not reproduce EFCC branding, text, logos, recruitment information, or its exact page content.

## Critical project constraints

1. **Modify the existing application in place. Do not scaffold or create a replacement application.**
2. Do not replace the project's framework, language, build setup, package manager, or routing system.
3. The existing frontend uses **React with TypeScript**. Preserve TypeScript; do not convert components to JavaScript.
4. Inspect the current project before editing. Identify the entry point, page components, shared layout, styles, assets, routes, and installed UI libraries.
5. Reuse and improve existing components where sensible. Avoid unnecessary dependencies and avoid duplicating components that already exist.
6. Preserve all working functionality, including authentication, registration, user roles, candidate and election data, voting, vote confirmation, admin tools, validation, API calls, database integration, and navigation, wherever those features exist.
7. Do not replace real application logic with mock data, sample dashboards, placeholder buttons, or hard-coded election results.
8. Do not change database schemas, API contracts, authentication rules, election rules, vote-counting logic, or security-sensitive behaviour as part of this visual task.
9. Keep existing routes and links working. Every visible interactive control must retain its current action or be connected to an existing valid action.
10. Do not delete existing features simply because they do not fit the new layout. Adapt their presentation instead.
11. Do not overwrite, remove, or rename existing assets unless there is a clear, necessary reason.
12. If an implementation detail is unclear, inspect related files and follow the existing project conventions rather than guessing.

## Visual identity and colour system

Build a consistent green-led design system using **solid, flat colours only**.

Suggested starting palette (adapt to the existing branding if it already has a suitable green):

- Primary green: `#168447`
- Deep green for hover/active states and dark accents: `#116B39`
- Very pale green for subtle backgrounds: `#F1F7F2`
- Main page background: `#FFFFFF`
- Secondary section background: `#F6F7F6`
- Main text: `#202522`
- Secondary text: `#68716B`
- Borders: `#E3E8E4`
- White text on green panels: `#FFFFFF`
- Error/danger: a clear accessible red such as `#B42318`
- Success: a clear accessible green that remains distinguishable from ordinary body text.

These are suggested values, not a reason to override an established brand identity. Keep green as the dominant accent and use neutral white, light grey, and dark text to maintain clarity.

### Strictly avoid

- Gradients of any kind.
- Glows, neon effects, glossy surfaces, glassmorphism, or shiny highlights.
- Excessive drop shadows or floating layers.
- Overly rounded pill-shaped buttons and cards everywhere.
- Decorative blobs, random circles, abstract AI-style background shapes, or unnecessary animation.
- Excessive use of icons, emoji, or illustrations.
- Randomly coloured cards that make the interface inconsistent.
- Huge headings, oversized whitespace, or oversized dashboard widgets that push useful information below the fold.
- Unnecessary carousels, auto-playing elements, or attention-seeking effects.

Use square or modestly rounded corners consistently. Use flat green backgrounds where a strong primary panel is needed. If shadows are used at all, keep them extremely subtle and functional.

## Page structure and layout direction

Study the existing application and apply the following principles to the pages and components that already exist. Do not create routes or pages that the application does not need.

### 1. Header and navigation

- Create a clean, white header that aligns its contents to a consistent central content width.
- Keep the existing logo and application name. If no logo exists, use a simple text-based brand treatment; do not invent an official logo.
- Make navigation compact, well-spaced, and easy to understand.
- Clearly indicate the active route using a simple underline, border, or flat green accent.
- Place primary account actions such as Sign in, Register, or the existing equivalent at the right on desktop when appropriate.
- On mobile, make navigation usable without horizontal overflow. Use the project's existing responsive navigation pattern if one exists.
- Ensure visible keyboard focus, readable labels, and adequate touch targets.

### 2. Main hero or page introduction

Where the existing home page has a hero or introduction, redesign it as a strong, clean **solid-green section** inspired by the reference screenshot.

- Use a flat primary-green background with white text where appropriate.
- Put the principal page heading and short explanation on one side.
- Put a small, orderly group of useful information cards or current-election details on the other side only if those details are already available in the application.
- Use concise, meaningful calls to action that lead to existing routes or functions.
- Keep text readable and the content vertically aligned.
- Do not invent statistics, voter counts, election dates, results, or status labels.
- If the current app is primarily a dashboard or login screen rather than a public home page, adapt the same visual principles to that actual screen instead of forcing in a landing-page hero.

### 3. Content sections

- Organise information into clearly separated sections with consistent margins and spacing.
- Use white and very light grey section backgrounds, with green for important emphasis.
- Prefer simple bordered cards with a white background, modest corner radius, and restrained spacing.
- Make headings, descriptions, metadata, and actions visually distinct.
- Keep related information together and avoid unnecessary visual clutter.
- Where elections, candidates, parties, or voting options already exist, present them in a clean, scannable layout without changing their meaning or order unless the current design clearly requires it.
- Use clear empty, loading, success, and error states wherever the existing application supports them.

### 4. Voting and election experience

The voting process is the core function and must remain especially clear and trustworthy.

- Make election details, eligibility information, candidate information, voting choices, and confirmation steps easy to understand.
- Use consistent spacing and clear labels around candidate choices and selection controls.
- Distinguish selected, unselected, disabled, and unavailable states clearly using accessible contrast and more than colour alone where practical.
- Keep the current confirmation steps and safeguards. Do not remove or weaken confirmation before a vote is submitted.
- Do not introduce additional steps that change the voting process.
- Do not make a vote appear submitted unless the existing application confirms successful submission.
- Do not expose private voter information or sensitive voting choices in new UI elements.
- Preserve all existing rules intended to prevent duplicate voting or unauthorised access.

### 5. Admin and account areas

For existing admin, account, and management screens:

- Apply the same header, typography, spacing, border, and green-accent system.
- Use clear page titles and straightforward action placement.
- Keep tables readable, with aligned columns, restrained borders, and responsive handling on smaller screens.
- Style filters, forms, pagination, alerts, and dialogs consistently.
- Preserve role-specific permissions and the distinction between administrator and voter capabilities.
- Do not add administrative controls or data that do not already exist.

### 6. Forms, buttons, and interactive states

- Use solid green for the primary action, with white text and an accessible hover/focus state.
- Use white or neutral backgrounds with green borders/text for secondary actions.
- Use clear danger styling only for genuinely destructive or high-risk actions.
- Keep button labels specific and meaningful.
- Give inputs consistent heights, spacing, labels, help text, validation messages, and focus indicators.
- Make disabled, loading, successful, and error states clear.
- Preserve the existing form validation and submission behaviour.

### 7. Footer

If the application already has a footer, refine it to match the new design. If a footer is appropriate for an existing public-facing page, use a simple dark charcoal or deep-green footer with readable text, orderly link groups, and a restrained divider. Keep only relevant existing links and information. Do not invent contact details, official affiliations, or legal claims.

## Typography

- Use the existing font if it is already appropriate and available.
- Otherwise, use a clean, modern sans-serif system font stack.
- Establish a clear hierarchy for page titles, section headings, card titles, body text, and small metadata.
- Use medium or semibold weights for headings; avoid making every element bold.
- Keep body text comfortable to read and line lengths controlled.
- Do not use excessively tiny text for important instructions or supporting information.

## Responsive behaviour

The UI must work well on desktop, tablet, and mobile.

- Use the existing responsive approach and CSS conventions.
- Prevent horizontal scrolling, overlapping content, clipped controls, and awkward card widths.
- Stack hero content and card grids naturally on small screens.
- Make forms and voting choices comfortable to use on touchscreens.
- Ensure tables have a sensible mobile treatment without silently hiding important information.
- Test navigation, dialogs, buttons, forms, and candidate-selection layouts at narrow widths.

## Accessibility and trust

- Maintain adequate colour contrast, especially white text on green backgrounds.
- Use semantic HTML and correctly associated form labels.
- Ensure all controls are keyboard accessible and have visible focus states.
- Do not rely on colour alone to communicate selection, success, errors, or election status.
- Use meaningful accessible names for icon-only controls.
- Respect reduced-motion preferences if transitions are present.
- Avoid visual patterns that could confuse voters or make important voting actions ambiguous.

## Implementation approach

Work in the following order:

1. Inspect the existing React + TypeScript codebase and identify the current design and all relevant screens.
2. Briefly map the existing pages/components and determine which files need UI changes.
3. Establish or refine reusable colour tokens, typography, spacing, borders, button styles, card styles, and responsive layout rules using the project's existing styling system.
4. Update the existing shared header/navigation and common components first.
5. Redesign the existing home page and other existing screens using the supplied reference's clean composition, adapted to a flat green palette.
6. Apply consistent styling to forms, candidate/election cards, tables, alerts, dialogs, and admin/account screens that already exist.
7. Verify that all existing interactions and business logic remain connected and functional.
8. Run the project's existing lint, type-check, build, and tests where available. Fix any issues introduced by the UI changes.
9. Review desktop and mobile layouts and remove any gradients, glows, unnecessary decoration, or inconsistent styling.
10. Summarise the files changed, the UI improvements made, and the checks that were actually run. Be honest about any checks that could not be run.

## Completion criteria

The work is complete only when:

- The existing application has been redesigned in place.
- The visual result is clean, restrained, professional, and recognisably inspired by the supplied screenshot's layout discipline.
- Green is the main accent and any large colour panels are solid, flat green.
- No gradients, glows, glossy effects, or decorative AI-style effects remain in the updated UI.
- Typography, spacing, buttons, cards, navigation, forms, and content sections are consistent.
- The UI responds properly to desktop and mobile screens.
- Existing React + TypeScript code, routes, voting logic, authentication, data connections, and other functionality remain intact.
- The app passes the available project checks, or any remaining failures are clearly reported.

**Final instruction:** Treat this file as a focused UI-redesign specification for the existing project. Inspect the actual application before editing. Make the smallest sensible set of changes needed to achieve the visual goal, and do not rebuild the product or alter its voting behaviour.
