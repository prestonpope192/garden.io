import { Pool } from "pg";
import type { GardenPlantProfile } from "@/lib/garden-app-types";

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    throw new Error("Missing SUPABASE_DB_URL");
  }

  pool = new Pool({
    connectionString,
    max: 3,
    ssl: { rejectUnauthorized: false }
  });

  return pool;
}

export async function getPlantProfiles(slug?: string): Promise<GardenPlantProfile[]> {
  const result = await getPool().query(
    `
      select
        v.*,
        c.cultivar_name,
        c.market_name,
        c.description as cultivar_description,
        ph.days_to_maturity_min,
        ph.days_to_maturity_max,
        ph.maturity_basis,
        ph.planting_window_label,
        ph.harvest_window_label,
        ph.perennial_first_harvest_label,
        cpf.frost_tender,
        coalesce(
          (
            select jsonb_agg(
              jsonb_build_object(
                'field_key', o.field_key,
                'override_scope', o.override_scope,
                'override_value', o.override_value,
                'evidence_strength_code', o.evidence_strength_code,
                'source_notes', o.source_notes
              )
              order by o.field_key
            )
            from catalog.plant_cultivar_overrides o
            where o.plant_profile_id = v.plant_profile_id
          ),
          '[]'::jsonb
        ) as cultivar_overrides
      from catalog.plant_profile_catalogue_view v
      left join catalog.plant_cultivars c on c.id = v.plant_cultivar_id
      left join catalog.plant_phenology_profiles ph on ph.plant_profile_id = v.plant_profile_id
      left join catalog.plant_climate_profiles cpf on cpf.plant_profile_id = v.plant_profile_id
      where ($1::text is null or v.slug = $1)
      order by v.display_name asc
    `,
    [slug || null]
  );

  return result.rows;
}
