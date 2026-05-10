# SYS.CORE Security Specification

## Data Invariants
1. A **User** profile must match the authenticated `request.auth.uid`. Users cannot modify their `subscription` status or `uid`.
2. **API Keys** must belong to the logged-in user. `usageCount` is immutable by the client (server-side only logic preferred, but client must be blocked from arbitrary updates).
3. **Waitlist** entries can be created by anyone (unsigned) but must have `status: 'pending'`.
4. **Components** are read-only for public/users. Only admins (if implemented) can write.

## The Dirty Dozen Payloads

| Payload ID | Target Path | Action | Payload Description | Security Exception Expected |
|:---|:---|:---|:---|:---|
| D01 | `/users/victim_uid` | Create | Attacker tries to create a profile for another user. | PERMISSION_DENIED (Identity Spoofing) |
| D02 | `/users/my_uid` | Update | User tries to escalate to `subscription: 'pro'`. | PERMISSION_DENIED (Privilege Escalation) |
| D03 | `/users/my_uid` | Update | User tries to add a `ghost_field: true`. | PERMISSION_DENIED (Strict Schema) |
| D04 | `/apiKeys/key_1` | Create | User tries to create key for `userId: 'other_user'`. | PERMISSION_DENIED (Ownership Bypass) |
| D05 | `/apiKeys/key_1` | Update | User tries to reset `usageCount` to `0`. | PERMISSION_DENIED (Field Immutability) |
| D06 | `/waitlist/test@test.com` | Create | User tries to set `status: 'converted'`. | PERMISSION_DENIED (State Manipulation) |
| D07 | `/components/comp_1` | Update | User tries to modify component source code. | PERMISSION_DENIED (Read-Only Resource) |
| D08 | `/users/long_id...` | Create | ID string exceeds 128 chars. | PERMISSION_DENIED (Resource Poisoning) |
| D09 | `/apiKeys/key_1` | Create | Key name is a 2MB string. | PERMISSION_DENIED (Denial of Wallet) |
| D10 | `/users/my_uid` | Get | Anonymous user tries to read private user profile. | PERMISSION_DENIED (Auth Requirement) |
| D11 | `/components` | List | Unfiltered query on components collection. | ALLOW (Public Resource) |
| D12 | `/apiKeys` | List | Trying to list all API keys without owner filter. | PERMISSION_DENIED (Query Enforcer) |

## Test Runner
See `firestore.rules.test.ts` for implementation.
