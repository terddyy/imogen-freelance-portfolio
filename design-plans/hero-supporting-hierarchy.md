# Clarify the hero supporting hierarchy

Written against: `2439679cb8850cdc244cc741663a9b2996aca8e7` with uncommitted homepage work present

## Evidence chain

- Surface: `/`, desktop hero and its existing mobile branch
- Problem: The rendered hero gives the role, two affiliations, introduction, two actions, and social links the same repeated vertical rhythm beneath the headline. This makes the supporting content read as one long stack and weakens the otherwise strong headline-to-action path.
- Design evidence: the supplied desktop screenshot; the current hero render in `output/hero-after-viewport.png`; the existing headline, availability badge, portrait composition, button variants, and muted text treatment in `app/globals.css`
- Owner: `components/HomeSections.tsx` (`HeroSection`) with presentation owned by the final hero override block in `app/globals.css`
- Scope and affected surfaces: homepage hero at desktop, tablet, and mobile widths only
- Uncertainty: the repository has no governing `DESIGN.md`; the supplied screenshot and current rendered artifacts are therefore the binding visual evidence

## Design decision

Turn the flat list beneath the headline into one supporting-content group with three explicit levels: professional identity, short introduction, then actions. Keep the existing copy, portrait, availability badge, colors, fonts, and buttons. This fixes the hierarchy without adding content, decoration, cards, or another visual system.

## Reuse

- Existing `.heroMetaInline`, `.heroIntro`, `.buttonRow`, `.heroPrimary`, `.heroSecondary`, `.socialRow`, and `.heroSocials` styles and compositions
- Existing hero accent `#8ceac4`, white primary action, muted supporting text, and current responsive breakpoints
- Exemplar: the headline already groups its sans-serif problem statement and serif green outcome as one clear unit in `components/HomeSections.tsx`

## Changes

1. `components/HomeSections.tsx`
   - Change: Inside `HeroSection`, wrap the role and employer links in a `heroIdentity` block. Keep the role as the block heading and place the two existing links in a nested `heroAffiliations` row. Wrap the existing introduction, button row, and social row in a `heroSupport` group so spacing is owned by meaning rather than by the current flat sibling list.
   - Preserve: All current copy, destinations, icon labels, source order, headline markup, portrait image, availability badge, and scroll cue.
   - Verify: A reader can scan headline, role, affiliations, introduction, and primary action in that order without the affiliations competing with the role.

2. `app/globals.css`
   - Change: In the final hero override block, give `heroSupport` a compact grid rhythm using the existing 20px hero spacing as its outer gap; give `heroIdentity` and `heroAffiliations` a tighter internal rhythm; retain the current role and link colors; and keep the affiliation row wrapping at desktop/tablet while using the existing column treatment at `430px` and below. Remove or supersede only the obsolete flat `.heroMetaInline strong` layout rules made redundant by the new grouping.
   - Preserve: Current headline sizing, background-image crop, shade gradients, hero height, CTA styling, entrance motion, reduced-motion behavior, and all non-hero selectors.
   - Verify: At 1366x1014 and 1440x900 the supporting block stays within the dark left field and does not overlap the portrait; at 390x844 it remains readable, the two buttons fit as they do now, and no content is clipped by the bottom navigation.

## Scope

- Inherit: Homepage hero desktop, tablet, and mobile responsive branches.
- Verify: The existing `heroCopy > *` entrance animation still reveals logical top-level groups in order and remains disabled under `prefers-reduced-motion`.
- Exclude: Header/navigation, portrait asset or crop, hero copy edits, CTA destinations, social destinations, selected-work section, global typography, and every other route.

## Validation

- Product: Open `/`; confirm the headline remains dominant and the primary CTA is the clear next step after the introduction.
- Interface: Compare 1440x900, 1366x1014, 768x1024, and 390x844; check link wrapping, long affiliation labels, keyboard focus, reduced motion, and browser zoom at 125%.
- System: Confirm the implementation reuses the existing button, social, muted-text, and accent treatments and introduces no new shared primitive or dependency.
- Repository: `npm run lint; if ($LASTEXITCODE -eq 0) { npm run build }` → both commands exit `0`.

## Stop conditions

- Stop if the current portrait/background or homepage hero markup is replaced by another collaborator before implementation, or if the improvement requires changing copy or other routes.

## Design documentation

- After acceptance and validation: none; this is a surface-local hierarchy correction and no governing design document currently exists.
