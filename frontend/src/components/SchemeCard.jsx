import { ExternalLink, Bookmark } from 'lucide-react'
import { localizedField } from '../lib/constants'
import { cn } from '../lib/utils'

export default function SchemeCard({
  scheme,
  language,
  t,
  matchPercentage,
  suitability,
  bookmarked,
  onBookmark,
  showBookmark = true,
}) {
  const title = localizedField(scheme, 'title', language)
  const benefits = localizedField(scheme, 'benefits', language)
  const documents = scheme.requiredDocuments || []

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
          {t(`cat.${scheme.category}`) || scheme.category}
        </span>
        {matchPercentage != null && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            {t('results.match')} {matchPercentage}%
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-1 text-sm font-medium text-slate-500">{scheme.department}</p>
      {suitability && (
        <p className="mt-2 inline-flex w-fit rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
          {t('results.eligible')}
        </p>
      )}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{benefits}</p>

      {documents.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('results.documents')}
          </p>
          <ul className="mt-1 space-y-1 text-sm text-slate-700">
            {documents.map((doc) => (
              <li key={doc} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {showBookmark && (
          <button
            type="button"
            onClick={() => onBookmark?.(scheme._id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold',
              bookmarked
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
            {bookmarked ? t('results.bookmarked') : t('results.bookmark')}
          </button>
        )}
        {scheme.applicationUrl && (
          <a
            href={scheme.applicationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-800 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-700"
          >
            <ExternalLink className="h-4 w-4" />
            {t('results.apply')}
          </a>
        )}
      </div>
    </article>
  )
}
