'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useAnimationControls } from 'framer-motion'
import { ArrowRight, Users, Trophy, Calendar, Star, ChevronDown } from 'lucide-react'

const typewriterWords = [
  'Critical Thinkers',
  'Eloquent Speakers',
  'Future Leaders',
  'Debate Champions',
  'Change Makers',
]

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = typewriterWords[currentWord]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayText.length < word.length) {
      timeout = setTimeout(() => setDisplayText(word.slice(0, displayText.length + 1)), 80)
    } else if (!isDeleting && displayText.length === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40)
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false)
      setCurrentWord((prev) => (prev + 1) % typewriterWords.length)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWord])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#1B8FD8]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F0C040]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#1B6B32]/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(27,143,216,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(27,143,216,0.2) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Animated particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#1B8FD8]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-blue-100 text-sm text-[#1B8FD8] font-bold mb-8"
        >
          <Star className="w-4 h-4 text-[#F0C040]" fill="currentColor" />
          Bangladesh&apos;s Premier Debate Club at Dhaka College
          <Star className="w-4 h-4 text-[#F0C040]" fill="currentColor" />
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#1B8FD8]/10 blur-2xl scale-150" />
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white ring-4 ring-white shadow-2xl shadow-[#1B8FD8]/20 flex items-center justify-center p-4">
              <Image
                src="/logo.png"
                alt="DCDS Logo"
                width={128}
                height={128}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          We Build
          <br />
          <span className="bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] bg-clip-text text-transparent">{displayText}</span>
          <span className="animate-pulse text-[#1B8FD8]">|</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Dhaka College Debating Society — Fostering critical thinking, public speaking,
          and leadership excellence since 1995.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/auth/register"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] shadow-lg hover:shadow-xl hover:shadow-[#1B8FD8]/30 transition-all duration-300 hover:-translate-y-1"
          >
            Join DCDS Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:text-[#1B8FD8] transition-all duration-300"
          >
            Discover DCDS
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16"
        >
          {[
            { icon: Trophy, value: '50+', label: 'Championships', color: '#F0C040' },
            { icon: Users, value: '500+', label: 'Members', color: '#1B8FD8' },
            { icon: Calendar, value: '30+', label: 'Years Active', color: '#1B6B32' },
            { icon: Star, value: '100+', label: 'Events Hosted', color: '#C41230' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-xl p-5 text-center transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-[#1B8FD8]" />
        </motion.div>
      </div>
    </section>
  )
}
