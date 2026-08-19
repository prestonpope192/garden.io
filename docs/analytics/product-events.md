# Product event contract

Garden records a small allowlisted set of authenticated product events through
`POST /api/analytics/events`. Event metadata is bounded and must not contain
prompts, notes, emails, tokens, or other free-form personal data.

Events currently emitted by the app:

- `app_opened` — once when an authenticated app view mounts; `view` identifies the view.
- `observation_saved` — after a garden note is saved; `has_note` is a boolean.
- `care_task_added` — after a care task is saved; `has_due_date` is a boolean.
- `care_task_completed` — after a care task is completed; `had_due_date` is a boolean.
- `diagnosis_saved` — after AI guidance is kept with a plant; `needs_confirmation` is a boolean.

The weekly-return checkpoint is the count of distinct `user_id` values with at
least one `app_opened` event in a calendar week and at least one `app_opened`
event in the following seven-day window. Run the query below with an approved
read-only database connection; it is intentionally not exposed through the
application API.

```sql
with opens as (
  select distinct user_id, date_trunc('day', occurred_at)::date as opened_on
  from public.garden_product_events
  where event_name = 'app_opened'
), returning_users as (
  select distinct a.user_id, a.opened_on
  from opens a
  join opens b on b.user_id = a.user_id
    and b.opened_on > a.opened_on
    and b.opened_on <= a.opened_on + 7
)
select opened_on, count(distinct user_id) as returning_users
from returning_users
group by opened_on
order by opened_on desc;
```
