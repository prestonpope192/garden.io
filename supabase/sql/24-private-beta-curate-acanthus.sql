-- Curate the first imported placeholder plant reference record.

update public.garden_catalog_plants
set
  common_name = 'Acanthus (Bear''s Breeches)',
  latin_name = 'Acanthus mollis',
  family = 'Acanthaceae',
  summary = 'Architectural herbaceous perennial grown for glossy, deeply lobed foliage and upright late-spring to midsummer flower spikes with white to pink flowers and purple bracts.',
  sun = 'Full sun to part shade',
  water = 'Medium; keep evenly moist while establishing and avoid waterlogged soil',
  soil = 'Average to fertile, well-drained soil; tolerates a range of soils except poorly drained sites',
  growing_requirements = jsonb_build_object(
    'sun', jsonb_build_object(
      'exposure_codes', array['full_sun', 'part_shade'],
      'min_direct_sun_hours', 3,
      'max_direct_sun_hours', 8,
      'ideal_direct_sun_hours', 5,
      'shade_tolerance_score', 7,
      'description', 'Performs in full sun to part shade; afternoon shade is useful in hotter sites.'
    ),
    'water', jsonb_build_object(
      'level_code', 'medium',
      'establishment', 'Keep evenly moist while roots establish.',
      'mature_inches_per_week_min', 0.5,
      'mature_inches_per_week_max', 1.0,
      'drought_tolerance_score', 5,
      'wet_feet_tolerance_score', 2,
      'description', 'Moderate water needs; tolerates some dryness after establishment but dislikes persistently wet soil.'
    ),
    'soil', jsonb_build_object(
      'drainage_codes', array['well_drained'],
      'texture_codes', array['loam', 'sandy_loam', 'clay_loam'],
      'fertility_code', 'average_to_fertile',
      'ph_min', 6.0,
      'ph_max', 7.8,
      'moisture_code', 'medium',
      'description', 'Best in average to fertile, well-drained soil; avoid poorly drained locations.'
    ),
    'habit', jsonb_build_object(
      'height_inches_min', 36,
      'height_inches_max', 60,
      'spread_inches_min', 24,
      'spread_inches_max', 36,
      'spreading_risk_score', 8,
      'description', 'Forms bold clumps and can spread by creeping rootstocks.'
    )
  ),
  fit_for = 'Specimen plantings, small groupings, formal borders, part-shade structure, Mediterranean-style perennial beds',
  public_note = 'Can spread aggressively by creeping rootstocks, especially in loose soils. Site intentionally, consider root barriers, and cut spent flower stalks after bloom. Watch for powdery mildew, slugs, and snails.',
  tags = array[
    'Curated',
    'Perennial',
    'Herbaceous perennial',
    'Architectural foliage',
    'Part shade',
    'Medium water',
    'Spreading',
    'Showy flowers',
    'Mediterranean'
  ],
  illustration = '/art/specimen-herbarium-sheet.svg',
  updated_at = now()
where slug = 'acanthus';
