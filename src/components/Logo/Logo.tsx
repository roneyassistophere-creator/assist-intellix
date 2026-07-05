import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import siteConfig from '@/config/site'

// Assist Intellix brand mark. Same artwork in light and dark mode — the gradient
// fill already has enough contrast against both backgrounds.
export const LogoMark = ({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 500 500"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={clsx('shrink-0', className)}
    style={style}
  >
    <defs>
      <linearGradient
        id="assist-intellix-logo-gradient-1"
        x1="148.86"
        y1="321.33"
        x2="475.72"
        y2="321.33"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#00adee" />
        <stop offset="1" stopColor="#0b279e" />
      </linearGradient>
      <linearGradient
        id="assist-intellix-logo-gradient-2"
        x1="24.28"
        y1="275.09"
        x2="279.61"
        y2="275.09"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#11b0e3" />
        <stop offset="1" stopColor="#026ce8" />
      </linearGradient>
      <linearGradient
        id="assist-intellix-logo-gradient-3"
        x1="77.02"
        y1="142.66"
        x2="309.72"
        y2="142.66"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#50e6d5" />
        <stop offset="1" stopColor="#1a85db" />
      </linearGradient>
    </defs>
    <path
      fill="url(#assist-intellix-logo-gradient-1)"
      d="M471.2,370.76l-66.47-114.84-6.01-10.34-39.6-66.71c-7.57-12.38-21.63-16.83-33.95-13.58-7.93,2.1-15.08,7.39-19.35,15.75l-36.06,59.49c-2.4,4.81-3.49,10.1-3.19,15.26.12,2.04.42,4.09.9,6.07.72,3,1.98,5.89,3.67,8.59l25,40.03.6.96,18.45,29.21,2.16,3.37c.78,1.2,1.44,2.4,2.04,3.67q0,.06.06.12v.06c7.09,15.86-2.16,35.64-18.93,37.98-.36,0-.72.06-1.08.06h-51.14c-5.77,0-32.69-.18-51.8-.3-8.65-.06-16.77,4.33-21.45,11.6l-21.21,32.81c-13.04,20.07,1.08,46.63,25,47.06l67.49,1.32c10.7.24,20.67-5.17,26.38-14.18l25.48-40.15c1.26-1.98,3.37-3.13,5.71-3.13h123.08l19.35.06c23.56-.96,36.96-29.99,24.88-50.24Z"
    />
    <path
      fill="url(#assist-intellix-logo-gradient-2)"
      d="M279.61,164.27l-38.16,60.28-57.39,90.51-35.94,56.67c-5.71,9.01-15.69,14.42-26.38,14.18l-67.49-1.32c-23.92-.42-38.04-26.98-25-47.06l47.78-73.8,130.35-64,72.24-35.46Z"
    />
    <path
      fill="url(#assist-intellix-logo-gradient-3)"
      d="M304.97,124.24l-25.36,40.02-72.24,35.46-130.35,64L224.74,35.54c12.74-19.65,41.95-18.27,52.7,2.52l28.85,55.77c4.99,9.68,4.51,21.21-1.32,30.41Z"
    />
  </svg>
)

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = ({ className, loading, priority }: Props) => {
  const { logo, name } = siteConfig

  if (logo.imagePath) {
    return (
      <Image
        alt={name}
        src={logo.imagePath}
        width={160}
        height={36}
        loading={loading ?? 'lazy'}
        fetchPriority={priority ?? 'low'}
        className={clsx('h-9 w-auto', className)}
      />
    )
  }

  return (
    <span
      className={clsx('flex items-center gap-3 select-none', className)}
      aria-label={name}
    >
      <LogoMark />
      <span className="font-bold text-xl tracking-tight leading-none">{logo.text ?? name}</span>
    </span>
  )
}
