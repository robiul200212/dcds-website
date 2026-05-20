import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/types'
import { formatDate, truncate } from '@/lib/utils'
import { BookOpen, ChevronRight, Clock } from 'lucide-react'

interface Props { articles: Partial<Article>[] }

export function NewsSection({ articles }: Props) {
  if (articles.length === 0) return null

  return (
    <section className="section-padding bg-[#0A1628] relative">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
              Articles & News
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
              Latest from <span className="gradient-text">DCDS</span>
            </h2>
          </div>
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-[#1B8FD8] font-semibold hover:gap-3 transition-all group whitespace-nowrap">
            All Articles <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group flex flex-col rounded-2xl border border-white/5 overflow-hidden bg-gradient-to-br from-white/3 to-transparent card-hover">
              {/* Cover */}
              <div className="relative h-44 bg-gradient-to-br from-[#1B8FD8]/20 to-[#0A1628] overflow-hidden">
                {article.cover_image_url ? (
                  <Image src={article.cover_image_url} alt={article.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-[#1B8FD8]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                {article.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-[#1B8FD8]/20 text-[#1B8FD8] border border-[#1B8FD8]/30 capitalize">
                    {article.category}
                  </span>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 p-5">
                <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-[#1B8FD8] transition-colors leading-tight">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {article.published_at ? formatDate(article.published_at, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
