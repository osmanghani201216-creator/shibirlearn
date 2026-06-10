# Security Spec & TDD Matrix

This document defines the strict security invariants, identity gates, and the validation matrix (The "Dirty Dozen" payloads) for the app's integration with Firestore.

## 1. Data Invariants

1. **Owner-Linked Integrity**: A user can only access (`get`, `list`, `create`, `update`, `delete`) resources under their own `/users/{userId}` branch.
2. **Immutable Keys & Constraints**: Fields denoting ownership (`userId`), creation bounds (`id`), or tracking timeline (`date`) must remain strictly immutable across update operations.
3. **Rigorous Payload Sizes**: Description fields (e.g., `text` in reflections, `notes` in prayer logs) are strictly size-capped to protect against bloated resource usage attacks.
4. **Strong Verification Check**: Every write operation requires the user's email to be certified as verified (`request.auth.token.email_verified == true`).

## 2. The "Dirty Dozen" Attack Vectors & Payloads

The following payloads represent unauthorized attempts to bypass security. Our security rules mathematically prevent all of these.

### 1. The Cross-User Hijack (Identity Spoofing)
*   **Attack Path**: User Alice (`uid_alice`) tries to write a reflection inside Bob's database path (`/users/uid_bob/reflections/ref1`).
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `isOwner(userId)`).

### 2. Unverified Write Attempt
*   **Attack Path**: An authenticated user whose email is not verified tries to create a new reflection.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `isVerifiedUser()`).

### 3. Reflection Size Flood (Denial of Wallet)
*   **Attack Path**: Setting a 1MB string to the `text` field in a reflection.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `data.text.size() <= 250`).

### 4. Over-Extended Shadow Keys
*   **Attack Path**: Creating a reflection with extra hidden properties like `{ "text": "...", "isAdmin": true, "vip": true }`.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `data.keys().size() == 6`).

### 5. ID Poisoning
*   **Attack Path**: Attacking with junk document IDs containing malicious Unicode characters or overflow widths.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `isValidId(reflectionId)`).

### 6. Relational Owner Tampering
*   **Attack Path**: Creating a reflection where `userId` is set to `uid_bob` even though the path is `users/uid_alice/reflections/...`.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `data.userId == request.auth.uid`).

### 7. Invalid Reflection Category Choice
*   **Attack Path**: Saving a reflection with an illegal category parameter: `{ "category": "malicious" }`.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by exact enum check on category).

### 8. Invalid Prayer State Choice
*   **Attack Path**: Setting prayer status to `'skipped_entirely'` instead of standard enum-validated keys.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by Prayer enum matchers).

### 9. Prayer Track Overextended Shape
*   **Attack Path**: Recording a prayer log containing unvalidated properties.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `data.keys().size() <= 11`).

### 10. Memory Bloat Prayer Note
*   **Attack Path**: Recording daily prayer notes exceeding 500 characters.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by `data.notes.size() <= 500`).

### 11. Profile Mutability Violation
*   **Attack Path**: Directly updating `userId` or `id` properties of a reflection to shift ownership.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by immutability check `incoming().id == existing().id && incoming().userId == existing().userId`).

### 12. Public/Private Collection Bleed
*   **Attack Path**: Storing full PII logs under the `/public/profile` space.
*   **Outcome**: `PERMISSION_DENIED` (Blocked by strict key constraints on public profile schema).
