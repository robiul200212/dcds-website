import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Clock, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Articles & Blog',
  description: 'Read articles, insights, and debate-related content from DCDS members.',
}

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('id,title,slug,excerpt,cover_image_url,category,tags,published_at,author_id,views')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#050D1A] pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
            Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Articles & <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Debate analysis, speech tips, academic insights, and more — written by DCDS members.
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link key={article.id} href={`/articles/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-white/5 overflow-hidden bg-gradient-to-br from-white/3 to-transparent card-hover">
                <div className="relative h-44 bg-gradient-to-br from-[#1B8FD8]/20 to-[#0A1628] overflow-hidden">
                  {article.cover_image_url ? (
                    <Image src={article.cover_image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-[#1B8FD8]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-[#1B8FD8]/20 text-[#1B8FD8] border border-[#1B8FD8]/30 capitalize">
                    {article.category}
                  </span>
                </div>
                <div className="flex-1 p-5">
                  <h2 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-[#1B8FD8] transition-colors leading-tight">{article.title}</h2>
                  {article.excerpt && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{article.excerpt}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {article.published_at ? formatDate(article.published_at, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                    {article.tags?.length > 0 && (
                      <div className="flex gap-1">
                        {article.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-500">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-dark rounded-2xl border border-white/5">
            <BookOpen className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-white font-semibold mb-1">No Articles Yet</p>
            <p className="text-gray-400 text-sm">Articles will appear here once published by admins.</p>
          </div>
        )}
      </div>
    </div>
  )
}
