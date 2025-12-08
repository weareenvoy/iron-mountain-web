# Coding Patterns & Guidelines

## State Management

### Global vs Local

- **React Context**: Use for global client-side state that needs to be accessed across the component tree (e.g., active
  tour session, user preferences).
- **MQTT State**: Treat remote device state as "server state". Use the `useMqtt` hook to subscribe to state topics and
  sync them to local React state.

### Syncing Strategy

When a controller changes a value (e.g., volume):

1. Optimistically update local UI.
2. Send MQTT command to target.
3. Revert if no confirmation/state update is received within timeout (optional but recommended).

## Component Structure

### Shadcn UI

We use a customized version of `shadcn/ui`.

- **Location**: `src/components/shadcn`
- **Usage**: Import directly from `@/components/shadcn/...`. Do not modify these files directly unless updating the
  design system globally. Wrap them if you need specific behavior.

### Atomic Design

- **Atoms**: Basic UI elements (Buttons, Inputs) -> `src/components/shadcn` or `src/components/ui`
- **Molecules**: Combinations (SearchBox, VolumeSlider) -> `src/components`
- **Organisms**: Complex sections (VideoPlayer, SlideDeck) -> `src/components`
- **Templates/Pages**: Next.js Pages -> `src/app`

## Hook Patterns

### `useMomentsNavigation`

Used for linear navigation through "Moments" and "Beats".

```typescript
const { handleNext, handlePrevious } = useMomentsNavigation(content, state, setState, 'basecamp');
```

Always use this hook when building linear presentation flows to ensure consistent behavior across different apps.

## Styling Guidelines

### Tailwind CSS v4

- Use the new v4 engine.
- **Variables**: Define theme colors in `src/app/globals.css` using standard CSS variables.
- **Spacing**: Stick to the default Tailwind spacing scale (4px increments).
- **Fonts**: Use `font-interstate` for headings and `font-geometria` for body text (configured in `layout.tsx`).

### CSS Modules

Avoid CSS modules. If you need complex animations that Tailwind can't handle, use `framer-motion` or standard CSS in
`globals.css` with utility classes.
