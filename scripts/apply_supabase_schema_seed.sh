#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_SQL="$ROOT_DIR/docs/product/specs/sql/10-garden-postgres-ddl.sql"
SEED_SQL="$ROOT_DIR/supabase/sql/10-garden-sample-seed.sql"
VALIDATE_SQL="$ROOT_DIR/supabase/sql/10-garden-validate.sql"

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "SUPABASE_DB_URL is not set."
  echo "Example: export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require'"
  exit 1
fi

echo "Applying schema: $SCHEMA_SQL"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$SCHEMA_SQL"

echo "Applying seed data: $SEED_SQL"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$SEED_SQL"

echo "Running validation: $VALIDATE_SQL"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$VALIDATE_SQL"

echo "Schema + seed + validation completed successfully."
