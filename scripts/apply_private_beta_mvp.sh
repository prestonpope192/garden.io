#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATION_SQL="$ROOT_DIR/supabase/sql/20-private-beta-mvp.sql"
VALIDATE_SQL="$ROOT_DIR/supabase/sql/21-private-beta-mvp-validate.sql"

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "SUPABASE_DB_URL is not set."
  echo "Example: export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require'"
  exit 1
fi

echo "Applying private beta MVP schema: $MIGRATION_SQL"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$MIGRATION_SQL"

echo "Running private beta MVP validation: $VALIDATE_SQL"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$VALIDATE_SQL"

echo "Private beta MVP schema validation completed successfully."
