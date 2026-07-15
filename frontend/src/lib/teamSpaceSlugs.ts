/**
 * The CMS stores long, SEO-oriented slugs for space_type services
 * (e.g. "conference-room-av-solutions-dubai") used by /services/:slug.
 * /teamspace/:slug uses short, human-friendly aliases instead — this
 * module maps between the two without touching the CMS records.
 */
export const TEAMSPACE_SLUGS: Record<string, string> = {
  'conference-rooms': 'conference-room-av-solutions-dubai',
  'huddle-space': 'huddle-space-av-solutions-dubai',
  'ideation-space': 'ideation-space-av-solutions-dubai',
  'immersive-video-rooms': 'immersive-video-rooms-av-solutions-dubai',
}

export function resolveTeamSpaceSlug(teamSpaceSlug: string): string {
  return TEAMSPACE_SLUGS[teamSpaceSlug] || teamSpaceSlug
}

export function teamSpacePath(serviceSlug: string): string {
  const alias = Object.keys(TEAMSPACE_SLUGS).find((key) => TEAMSPACE_SLUGS[key] === serviceSlug)
  return `/teamspace/${alias || serviceSlug}`
}
