# Specification

## Summary
**Goal:** Fix the keyboard input deselection bug in the "Add New Product" modal on the Admin Dashboard so that typing in any field works without losing focus.

**Planned changes:**
- Refactor the "Add New Product" modal form state in `AdminDashboardPage.tsx` to prevent re-renders from unmounting/remounting input fields on each keystroke
- Ensure all `onChange` handlers are stable (e.g., via `useCallback` or defined outside the render cycle)
- Separate modal open/close state from form field state so that form values are not re-initialized on every keystroke
- Ensure all controlled inputs (Name, SKU, Description, Price, Stock, Image URL) maintain focus continuously while typing

**User-visible outcome:** Admins can click into any field in the "Add New Product" modal and type freely without the field losing focus or deselecting between characters.
