# User Management and Shared Access Module Spec

## Document Status and Scope

- Status: canonical Module 08 product specification.
- Effective date: March 9, 2026.
- Module role: lightweight collaboration and access control for properties.
- Product position: system-level capability across modules, not a standalone top-level planning module.
- Scope: property-level sharing, role permissions, task assignment, collaborative records, and multi-property switching.
- Out of scope: enterprise SSO, advanced org hierarchy, and deep compliance workflow implementation details.

## Module North Star and Collaboration Philosophy

Collaboration should feel like sharing a garden notebook with trusted helpers, family, or a small team.

North-star statement:
- enable shared work and accountability without introducing enterprise complexity or rigid workflow overhead.

Design goals:
- natural and lightweight
- permission-safe
- clear contributor visibility
- minimal configuration burden

## Core Collaboration Model (Property-Scoped Access)

Access scope rule:
- collaboration is granted at the property level only.
- there is no global account-wide blanket access to all properties by default.

Example:
- sharing `Preston Homestead` grants access to that property only.

Scope contract:

```txt
AccessScope = property
```

Membership contract:

```txt
PropertyMembership {
  property_id,
  user_id,
  role,
  invited_by_user_id,
  status,            // pending | active | removed
  created_at
}
```

## Role Model and Permission Matrix

Role contract:

```txt
CollaboratorRole = owner | manager | contributor | viewer
```

### Owner

Capabilities:
- full property control
- invite and remove users
- manage billing
- delete property
- edit structure and plants
- assign tasks

### Manager

Capabilities:
- add and edit zones and beds
- add plants
- assign and complete tasks
- add notes and observations

Restrictions:
- cannot delete property
- cannot manage billing

### Contributor

Capabilities:
- complete tasks
- add notes
- upload photos
- report plant issues

Restrictions:
- cannot modify structural elements (zones and beds)
- cannot alter role settings

### Viewer

Capabilities:
- view plants, notes, and tasks

Restrictions:
- cannot modify data

Permission matrix contract:

```txt
PermissionAction =
  manage_billing |
  delete_property |
  invite_user |
  remove_user |
  edit_structure |
  add_plant |
  assign_task |
  complete_task |
  add_note |
  upload_photo |
  report_issue |
  view_property
```

## Invitation and Acceptance Flows

Invitation workflow:
1. owner opens property settings
2. selects `Invite collaborator`
3. enters email and role
4. sends invitation email

Acceptance workflow:
1. invitee receives email link
2. signs in or creates account
3. invitation is accepted
4. property appears in account switcher

Invitation contract:

```txt
PropertyInvitation {
  invitation_id,
  property_id,
  email,
  role,
  invited_by_user_id,
  status,             // pending | accepted | expired | revoked
  expires_at
}
```

## Multi-Property Accounts and Property Switcher

Users may belong to multiple properties.

Examples:
- Preston Homestead
- Family Garden
- Community Orchard

Property switcher requirements:
- located near top navigation
- shows current property and available memberships
- preserves user role context per selected property

Switcher contract:

```txt
PropertySwitcherState {
  current_property_id,
  available_properties[],
  role_by_property{}
}
```

## Task Assignment Model

Tasks support assignee linkage.

Assignee options:
- specific collaborator
- unassigned

Assignment contract:

```txt
TaskAssignment {
  task_id,
  assignee_user_id?,   // null means unassigned
  assigned_by_user_id?,
  assigned_at?
}
```

Assignment permission rules:
- owner and manager can assign tasks.
- contributor and viewer cannot assign tasks.

## Assigned Task Visibility and Filtering

Task views must support assignment filters:
- my tasks
- team tasks
- unassigned tasks

Primary surface:
- Calendar task views

Secondary surface:
- My Property contextual task drawer

Filter contract:

```txt
AssignmentFilter = my_tasks | team_tasks | unassigned | all
```

## Notifications and Delivery Rules

Users receive notifications for:
- assigned tasks
- upcoming tasks
- AI insights tied to assigned context

Channels:
- in-app notifications
- email notifications
- SMS for paid-tier eligible experiences

Notification principles:
- actionable and concise
- avoid alert fatigue
- respect role and scope boundaries

## Activity Feed Contract

Each property includes a lightweight activity feed.

Tracked activity types:
- task completion
- note creation
- photo upload
- plant creation/update
- assignment changes

Feed example:
- Alex completed `Harvest strawberries`.
- Jordan added note to `Blueberry Bed`.

Feed contract:

```txt
ActivityEvent {
  event_id,
  property_id,
  actor_user_id,
  event_type,
  source_ref,
  summary,
  created_at
}
```

## Collaborative Notes and Photos

Notes are collaborative and attributed.

Collaborative note behavior:
- users can add follow-up comments to existing observation threads.
- note authorship and timestamp are always visible.

Photo behavior:
- uploads include uploader attribution.
- photos are visible in plant history, bed history, and issue reports based on permissions.

Attribution contract:

```txt
ContributionAttribution {
  contribution_id,
  property_id,
  created_by_user_id,
  created_at,
  edited_by_user_id?,
  edited_at?
}
```

## Permission Guardrails and Safety

Permission guardrails:
- contributors cannot delete or restructure beds/zones.
- viewers cannot create or modify tasks.
- managers cannot delete property or manage billing.

Safety principles:
- destructive actions require clear confirmation.
- permission errors should be informative and non-technical.

Audit requirement:
- permission-sensitive actions should be traceable in activity logs.

## Property Settings and Ownership Controls

Property settings must include:
- property name
- location
- climate zone
- collaborator list with roles
- invitation controls
- export data action
- delete property action (owner only)

Ownership transfer:
- owner can transfer ownership to another active collaborator.
- transfer requires explicit confirmation and preserves property history.

Ownership transfer contract:

```txt
OwnershipTransfer {
  property_id,
  from_user_id,
  to_user_id,
  initiated_at,
  confirmed_at
}
```

## Shared and Community Templates

Shared templates:
- templates can be shared inside a property collaboration context.
- collaborators with eligible permissions can apply shared templates to beds.

Community templates:
- users may publish templates publicly.
- public templates are discoverable and reusable by other users.

Visibility contract:

```txt
TemplateVisibility = private | property_shared | community_public
```

## Privacy and Security Boundaries

Public elements:
- catalogue entries
- public plant comments
- community templates

Private elements:
- property structure
- plant records
- task history
- notes and observation threads
- collaborator activity feed

Security principles:
- least-privilege access by role
- property-scoped authorization checks on every mutating action
- clear separation between public knowledge surfaces and private property data

## Responsive Behavior (Desktop and Mobile)

### Mobile

Mobile collaboration priorities:
- assign task quickly (one-tap assignee selection from task context)
- upload photo with attribution
- add collaborative note fast

Mobile UI rules:
- keep role and assignment interactions compact
- preserve clarity of who did what

### Desktop

Desktop collaboration priorities:
- richer assignment views in Calendar
- visible activity feed side panel
- efficient collaborator and role management in settings

## Core User Flows

Flow 1: Invite collaborator
1. owner opens property settings
2. selects invite action
3. enters email and role
4. sends invitation
5. collaborator accepts and appears in membership list

Flow 2: Complete assigned task
1. collaborator opens Calendar
2. filters to `My Tasks`
3. completes assigned task
4. adds observation note
5. activity feed logs completion

Flow 3: Add collaborative observation
1. collaborator opens plant record
2. adds note and photo
3. other collaborators view update in history and feed
4. follow-up comment chain can be added

Flow 4: Transfer ownership
1. owner opens settings
2. selects transfer ownership
3. selects target collaborator
4. confirms transfer
5. ownership roles update and are logged

## Functional Requirements

FR-01 Collaboration is property-scoped and role-based.
FR-02 Role model includes owner, manager, contributor, and viewer.
FR-03 Invitation workflow supports email invite and role selection.
FR-04 Invitation acceptance supports account creation and property onboarding.
FR-05 Multi-property membership and switcher are supported.
FR-06 Tasks support assignee linkage and assignment filtering.
FR-07 Assignment updates are permission-gated.
FR-08 Activity feed logs core collaborative actions.
FR-09 Collaborative notes and photos preserve attribution metadata.
FR-10 Property settings include collaborator management and core property metadata.
FR-11 Ownership transfer is supported with explicit confirmation.
FR-12 Templates support private, property-shared, and public visibility modes.
FR-13 Privacy boundaries separate public catalogue/community content from private property data.
FR-14 Notification channels support assignment and upcoming-work signals by eligibility.
FR-15 Mobile interactions support lightweight collaboration without role confusion.
FR-16 Desktop surfaces support assignment and feed visibility at higher density.
FR-17 Permission failures return clear user-facing guidance.
FR-18 Collaboration features avoid enterprise-complex configuration burdens.

## Non-Functional Requirements

Security:
- enforce authorization checks on read/write operations by property and role.
- preserve immutable attribution for key collaborative actions.

Usability:
- role capabilities should be understandable without reading documentation.
- collaborator flows should complete in minimal steps.

Performance:
- switcher and activity feed should update promptly after collaborative actions.
- assignment filters should feel immediate in normal usage.

## Paid vs Free Surface Behavior

Core collaboration support should remain available in free and paid tiers.

Tier-related differences:
- paid may include enhanced reminder channels (for example SMS) and richer AI-assignment assistance.
- baseline invitation, roles, and task assignment should not require paid tier for small-team usefulness.

## Out of Scope for Module 08

- enterprise directory sync and SSO
- hierarchical organization admin structures
- advanced legal/compliance retention policies
- payroll/time-sheet style labor accounting

## Acceptance Criteria and Test Scenarios

1. Property scope test  
Given user is collaborator on one property, when switching properties, then access is limited to explicitly shared properties.

2. Role enforcement test  
Given each role, when attempting restricted actions, then permission boundaries are enforced correctly.

3. Invite flow test  
Given owner sends invite, when invitee accepts, then membership is created with selected role.

4. Multi-property switch test  
Given user with multiple memberships, when switching properties, then role context and data scope update correctly.

5. Assignment filter test  
Given mixed assignments, when filtering `My Tasks`, `Team Tasks`, and `Unassigned`, then task lists match expected ownership.

6. Assignment permission test  
Given contributor role, when attempting assignment change, then action is blocked with clear explanation.

7. Activity feed test  
Given collaborator actions, when feed loads, then completed tasks, notes, photos, and assignments are represented with attribution.

8. Collaborative note test  
Given note thread, when second collaborator comments, then both entries retain author identity and chronology.

9. Photo attribution test  
Given uploaded photo, when viewed in history, then uploader attribution is visible.

10. Ownership transfer test  
Given owner transfer action, when confirmed, then target collaborator becomes owner and prior owner role updates.

11. Privacy boundary test  
Given public visitor, when accessing property records, then private structures/tasks/notes are not exposed.

12. Mobile simplicity test  
Given mobile device, when assigning task or adding collaborative note, then flow completes in minimal interactions.

## Open Questions Deferred to Module 10 (Database Architecture)

- how module-level permission checks should be enforced consistently across service boundaries
- how activity events should be emitted and consumed across Calendar, My Property, My Plants, and Task System
- how invitation and membership state transitions should be modeled in the core architecture
- how collaboration data should be partitioned and cached for multi-property switching performance
