# Feature Structure Guide

This repository is moving to a feature-first structure in safe phases.

## Canonical Source Layout

- src/features
- src/components
- src/services
- src/utils
- src/config

## Canonical Feature Names

Use lowercase-hyphen folder names:

- auth
- quick-tasks
- cover-role
- job-application
- job-details
- matching
- wallet
- rewards
- referral
- user-profile
- company-profile

## Naming Rules

- Folders and files: lowercase-hyphen when creating new modules.
- Variables and functions: camelCase.
- React components: PascalCase.

## Migration Policy

- Do not change business logic during naming or move-only changes.
- Prefer small PRs focused on one feature at a time.
- Keep compatibility by updating imports in the same PR as any rename.
- Run build and smoke checks after each incremental move.

## Suggested Incremental Order

1. auth (login/signup, forgot/reset password)
2. jobs (job-details, job-application)
3. wallet and rewards
4. referral and profile (user-profile, company-profile)
5. matching and quick-tasks/cover-role specific modules

## Notes For Current Codebase

- Existing folders can remain during migration.
- New modules should be created only in src/features/* and shared layers above.
- Deprecated paths should be removed only after all imports are updated.
