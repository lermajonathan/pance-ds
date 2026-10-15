/* Pance · Avatars — Avatar, AvatarGroup */

/* ── Avatar ────────────────────────────────────────────────────────────── */
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'
const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
  busy: 'bg-rose-500',
  offline: 'bg-slate-300',
}

export function Avatar({
  src, name, size = 36, ring, status, square, decorative, statusLabel,
}: {
  src?: string
  name: string
  size?: number
  ring?: boolean
  status?: AvatarStatus
  square?: boolean
  /** Set when the name is already shown as text next to the avatar, so screen readers don't hear it twice. */
  decorative?: boolean
  /** Spoken status, e.g. a translated "Online". Defaults to the status key. */
  statusLabel?: string
}) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  const radius = square ? 'rounded-xl' : 'rounded-full'
  const statusSize = Math.max(8, Math.round(size * 0.27))
  const inner = src ? (
    <img src={src} alt={decorative ? '' : name} style={{ width: size, height: size }} className={`shrink-0 ${radius} bg-ground object-cover ${ring ? 'ring-2 ring-surface' : ''}`} />
  ) : (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`grid shrink-0 place-items-center ${radius} bg-brand-100 font-semibold text-brand-700 ${ring ? 'ring-2 ring-surface' : ''}`}>
      {initials}
    </span>
  )
  if (!status) return inner
  return (
    <span className="relative inline-flex shrink-0">
      {inner}
      <span
        style={{ width: statusSize, height: statusSize, bottom: ring ? 1 : 0, right: ring ? 1 : 0 }}
        role="img"
        aria-label={statusLabel ?? status}
        className={`absolute rounded-full ring-2 ring-surface ${STATUS_COLOR[status]}`}
      />
    </span>
  )
}

export function AvatarGroup({ people, max = 4 }: { people: { name: string; src?: string }[]; max?: number }) {
  const shown = people.slice(0, max)
  const extra = people.length - max
  return (
    <div className="flex -space-x-2">
      {shown.map((p) => (
        <Avatar key={p.name} name={p.name} src={p.src} size={32} ring />
      ))}
      {extra > 0 && (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700 ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  )
}
