'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Link, Zap } from 'lucide-react'

import { LogoMark } from '@/components/Logo/Logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TimelineItem {
  id: number
  title: string
  date: string
  content: string
  category: string
  icon: React.ElementType
  relatedIds: number[]
  status: 'completed' | 'in-progress' | 'pending'
  /** Overrides the status text on the card badge (e.g. "STEP 1"). */
  badgeLabel?: string
  /** When omitted, the card's meter row is hidden entirely. */
  energy?: number
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[]
}

// Must match the node dots' own `duration-700` rotation exactly (see the node
// div's className below) — and use the same default easing Tailwind applies
// alongside `transition-all` (cubic-bezier(0.4,0,0.2,1)) — so the expanded
// card's slide/fade finishes at the same moment the dot physically arrives
// at/leaves the top position, instead of racing ahead of it.
const NODE_ROTATION_MS = 700
const NODE_ROTATION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [viewMode] = useState<'orbital'>('orbital')
  const [rotationAngle, setRotationAngle] = useState<number>(0)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({})
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null)
  const [orbitScale, setOrbitScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const userSelectedRef = useRef(false)

  // The expanded card is rendered once, independent of any single node's own
  // `transition-all duration-700` rotation animation — attaching it to whichever
  // node div is currently expanded (the previous approach) meant it vanished
  // instantly on one node and reappeared instantly on another, mid-rotation.
  // These two slots hold the outgoing and incoming card during the ~320ms
  // crossfade/slide so it reads as a single carousel instead of a hard cut.
  const [displayedItem, setDisplayedItem] = useState<TimelineItem | null>(null)
  const [outgoingItem, setOutgoingItem] = useState<TimelineItem | null>(null)
  const [cardDirection, setCardDirection] = useState<'forward' | 'backward'>('forward')
  const displayedItemRef = useRef<TimelineItem | null>(null)
  const cardTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // A static scale on the orbit's container (no CSS transition on this element)
  // shrinks the whole orbit uniformly on mobile. Driving the per-node `radius`
  // instead would fight the nodes' own `transition-all duration-700`, which
  // retargets every 50ms as they rotate — a one-time radius step never catches
  // up under that transition and stays visually oversized for several seconds.
  useEffect(() => {
    const updateScale = () => setOrbitScale(window.innerWidth < 640 ? 0.7 : 1)
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      userSelectedRef.current = true
      setExpandedItems({})
      setActiveNodeId(null)
      setPulseEffect({})
      setAutoRotate(true)
    }
  }

  const toggleItem = (id: number) => {
    userSelectedRef.current = true
    setExpandedItems((prev) => {
      const newState = { ...prev }
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false
        }
      })

      newState[id] = !prev[id]

      if (!prev[id]) {
        setActiveNodeId(id)
        setAutoRotate(false)

        const relatedItems = getRelatedItems(id)
        const newPulseEffect: Record<number, boolean> = {}
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true
        })
        setPulseEffect(newPulseEffect)

        centerViewOnNode(id)
      } else {
        setActiveNodeId(null)
        setAutoRotate(true)
        setPulseEffect({})
      }

      return newState
    })
  }

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>

    if (autoRotate && viewMode === 'orbital') {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360
          return Number(newAngle.toFixed(3))
        })
      }, 50)
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer)
      }
    }
  }, [autoRotate, viewMode])

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== 'orbital' || !nodeRefs.current[nodeId]) return

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId)
    const totalNodes = timelineData.length
    const targetAngle = (nodeIndex / totalNodes) * 360

    setRotationAngle(270 - targetAngle)
  }

  // By default, one card is always open so the section reads as populated rather
  // than an empty ring — it auto-advances through the nodes one at a time until
  // the user makes their own selection (click a node or the background), at
  // which point `userSelectedRef` permanently hands control over to them. The
  // section mounts with the rest of the homepage, long before it's scrolled
  // into view, so the recurring cycle only starts once it's actually visible —
  // and fires one quick advance right away so a first-time viewer catches the
  // movement instead of staring at a static card for a full interval.
  useEffect(() => {
    if (timelineData.length === 0) return

    const selectByIndex = (index: number) => {
      const item = timelineData[index]
      if (!item) return
      setExpandedItems({ [item.id]: true })
      setActiveNodeId(item.id)
      setAutoRotate(false)
      const newPulseEffect: Record<number, boolean> = {}
      item.relatedIds.forEach((relId) => {
        newPulseEffect[relId] = true
      })
      setPulseEffect(newPulseEffect)
      centerViewOnNode(item.id)
    }

    let index = 0
    selectByIndex(index)

    const CYCLE_MS = 2000
    let intervalId: ReturnType<typeof setInterval> | null = null
    let revealTimeoutId: ReturnType<typeof setTimeout> | null = null

    const advance = () => {
      if (userSelectedRef.current) return
      index = (index + 1) % timelineData.length
      selectByIndex(index)
    }

    const container = containerRef.current
    const observer = container
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting || intervalId) return
            revealTimeoutId = setTimeout(advance, 350)
            intervalId = setInterval(advance, CYCLE_MS)
          },
          { threshold: 0.5 },
        )
      : null
    if (container && observer) observer.observe(container)

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (revealTimeoutId) clearTimeout(revealTimeoutId)
      observer?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360
    const radius = 200
    const radian = (angle * Math.PI) / 180

    const x = radius * Math.cos(radian) + centerOffset.x
    const y = radius * Math.sin(radian) + centerOffset.y

    const zIndex = Math.round(100 + 50 * Math.cos(radian))
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)))

    return { x, y, angle, zIndex, opacity }
  }

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId)
    return currentItem ? currentItem.relatedIds : []
  }

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false
    const relatedItems = getRelatedItems(activeNodeId)
    return relatedItems.includes(itemId)
  }

  const getStatusStyles = (status: TimelineItem['status']): string => {
    switch (status) {
      case 'completed':
        return 'text-white bg-black border-white'
      case 'in-progress':
        return 'text-black bg-white border-black'
      case 'pending':
        return 'text-white bg-black/40 border-white/50'
      default:
        return 'text-white bg-black/40 border-white/50'
    }
  }

  const activeItemId = timelineData.find((item) => expandedItems[item.id])?.id ?? null

  // Cross-fades the expanded card between items: whenever the expanded item
  // changes, the previous one is kept mounted just long enough to slide/fade
  // out while the next slides/fades in from the side matching its position on
  // the orbit. The nodes sit on a circle with no real "first" or "last" — so
  // direction is the *shortest way around* (e.g. the last node back to the
  // first is one step forward, not a long way backward), not a plain index
  // comparison, which treated the array's two ends as a hard boundary and
  // made that one wrap-around click slide in from the wrong side.
  useEffect(() => {
    const current = displayedItemRef.current
    if ((current?.id ?? null) === activeItemId) return

    const nextItem =
      activeItemId !== null ? (timelineData.find((i) => i.id === activeItemId) ?? null) : null

    if (current) {
      const total = timelineData.length
      const fromIndex = timelineData.findIndex((i) => i.id === current.id)
      const toIndex = nextItem ? timelineData.findIndex((i) => i.id === nextItem.id) : fromIndex
      const circularDiff = (((toIndex - fromIndex) % total) + total) % total
      const shortestDiff = circularDiff > total / 2 ? circularDiff - total : circularDiff
      setCardDirection(shortestDiff >= 0 ? 'forward' : 'backward')
      setOutgoingItem(current)
      if (cardTransitionTimeoutRef.current) clearTimeout(cardTransitionTimeoutRef.current)
      cardTransitionTimeoutRef.current = setTimeout(() => setOutgoingItem(null), NODE_ROTATION_MS)
    }

    displayedItemRef.current = nextItem
    setDisplayedItem(nextItem)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItemId])

  useEffect(() => {
    return () => {
      if (cardTransitionTimeoutRef.current) clearTimeout(cardTransitionTimeoutRef.current)
    }
  }, [])

  const renderExpandedCard = (item: TimelineItem) => (
    <>
      <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-white/50" />
      <Card className="w-full overflow-visible border-white/30 bg-black/90 shadow-xl shadow-white/10 backdrop-blur-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
              {item.badgeLabel ??
                (item.status === 'completed'
                  ? 'COMPLETE'
                  : item.status === 'in-progress'
                    ? 'IN PROGRESS'
                    : 'PENDING')}
            </Badge>
            <span className="font-mono text-xs text-white/50">{item.date}</span>
          </div>
          <CardTitle className="mt-2 text-sm text-white">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-white/80">
          <p>{item.content}</p>

          {typeof item.energy === 'number' && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center">
                  <Zap size={10} className="mr-1" />
                  Energy Level
                </span>
                <span className="font-mono">{item.energy}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${item.energy}%` }}
                ></div>
              </div>
            </div>
          )}

          {item.relatedIds.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="mb-2 flex items-center">
                <Link size={10} className="mr-1 text-white/70" />
                <h4 className="text-xs font-medium tracking-wider text-white/70 uppercase">
                  Connected Nodes
                </h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.relatedIds.map((relatedId) => {
                  const relatedItem = timelineData.find((i) => i.id === relatedId)
                  return (
                    <Button
                      key={relatedId}
                      variant="outline"
                      size="sm"
                      className="flex h-6 items-center rounded-none border-white/20 bg-transparent px-2 py-0 text-xs text-white/80 transition-all hover:bg-white/10 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleItem(relatedId)
                      }}
                    >
                      {relatedItem?.title}
                      <ArrowRight size={8} className="ml-1 text-white/60" />
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )

  return (
    <div
      className="flex min-h-[620px] sm:min-h-[720px] w-full flex-col items-center justify-center overflow-hidden bg-black py-16"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative flex h-full w-full max-w-4xl items-center justify-center">
        <div
          className="absolute flex h-full w-full items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: '1000px',
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px) scale(${orbitScale})`,
          }}
        >
          <div className="absolute z-10 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500">
            <div className="absolute h-20 w-20 animate-ping rounded-full border border-white/20 opacity-70"></div>
            <div
              className="absolute h-24 w-24 animate-ping rounded-full border border-white/10 opacity-50"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md">
              <LogoMark className="size-5" />
            </div>
          </div>

          <div className="absolute h-96 w-96 rounded-full border border-white/10"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length)
            const isExpanded = expandedItems[item.id]
            const isRelated = isRelatedToActive(item.id)
            const isPulsing = pulseEffect[item.id]
            const Icon = item.icon
            const glowSize = (item.energy ?? 40) * 0.5 + 40

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            }

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el
                }}
                className="absolute cursor-pointer transition-all duration-700"
                style={nodeStyle}
                // The auto-rotation interval (in the effect above) starts ticking
                // immediately on mount, so by the time hydration compares markup,
                // this position/opacity has often already advanced past the
                // server-rendered snapshot — an expected side effect of a live
                // animation, not a real mismatch, so it isn't worth suppressing
                // the rotation or delaying its start just to avoid the warning.
                suppressHydrationWarning
                onClick={(e) => {
                  e.stopPropagation()
                  toggleItem(item.id)
                }}
              >
                <div
                  className={`absolute -inset-1 rounded-full ${
                    isPulsing ? 'animate-pulse duration-1000' : ''
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${glowSize}px`,
                    height: `${glowSize}px`,
                    left: `-${(glowSize - 40) / 2}px`,
                    top: `-${(glowSize - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`flex h-10 w-10 transform items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isExpanded
                      ? 'scale-150 border-white bg-white text-black shadow-lg shadow-white/30'
                      : isRelated
                        ? 'animate-pulse border-white bg-white/50 text-black'
                        : 'border-white/40 bg-black text-white'
                  }`}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${
                    isExpanded ? 'scale-125 text-white' : 'text-white/70'
                  }`}
                >
                  {item.title}
                </div>
              </div>
            )
          })}

          {/* Fixed carousel slot for the expanded card — anchored at the "top"
              orbit position (angle 270, same spot the previously-selected node
              always rotates to), independent of the nodes' own rotation so
              switching cards is a clean crossfade/slide, not tied to whichever
              node div happens to currently be mid-rotation. */}
          <div className="absolute z-30 w-64" style={{ transform: 'translate(0px, -200px)' }}>
            <div className="relative">
              {outgoingItem && (
                <div
                  key={`out-${outgoingItem.id}`}
                  className="absolute inset-x-0 top-20"
                  style={{
                    animation: `${
                      cardDirection === 'forward'
                        ? 'orbit-card-slide-out-left'
                        : 'orbit-card-slide-out-right'
                    } ${NODE_ROTATION_MS}ms ${NODE_ROTATION_EASING} forwards`,
                  }}
                >
                  {renderExpandedCard(outgoingItem)}
                </div>
              )}
              {displayedItem && (
                <div
                  key={`in-${displayedItem.id}`}
                  className="absolute inset-x-0 top-20"
                  style={{
                    animation: `${
                      cardDirection === 'forward'
                        ? 'orbit-card-slide-in-right'
                        : 'orbit-card-slide-in-left'
                    } ${NODE_ROTATION_MS}ms ${NODE_ROTATION_EASING} forwards`,
                  }}
                >
                  {renderExpandedCard(displayedItem)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        /* Full-width (not a small px nudge) so the outgoing and incoming cards
           never visually overlap mid-flight — a small offset leaves both
           mostly stacked in place, double-exposing their text as one fades
           under the other instead of genuinely passing each other. */
        @keyframes orbit-card-slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes orbit-card-slide-out-left {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes orbit-card-slide-in-left {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes orbit-card-slide-out-right {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
