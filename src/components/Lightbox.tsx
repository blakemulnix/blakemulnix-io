import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Photo } from '../data/photos.generated'
import { palette } from '../theme'
import { photoSrc, photoSrcSet } from './photoSrc'

interface LightboxProps {
  photos: Photo[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
  /**
   * The album being looked through. Shown with the position in it, since
   * the viewer is now the album: there is no page behind it saying which
   * collection this is or how far through you are.
   */
  title?: string
  /**
   * Pairs this frame with the print that opened it, so the browser grows one
   * into the other. Set only when the viewer was opened from a collection's
   * cover. Set only at the front of an album, which is where the cover
   * opens to.
   */
  morphName?: string
}

/**
 * Element fullscreen, where the browser has it, as a function that can be
 * called or a null saying do not bother.
 *
 * Safari on iPhone has no element fullscreen API whatsoever, prefixed or
 * otherwise; iPad has it under the webkit prefix. So this really can come
 * back empty, and the layout has to be worth looking at without it, which is
 * what the safe-area insets and `viewport-fit=cover` are for.
 */
const fullscreenRequest = () => {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>
  }
  const request = el.requestFullscreen ?? el.webkitRequestFullscreen
  return request ? () => request.call(el) : null
}

const exitFullscreen = () => {
  if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
}

/**
 * The photo itself, cross-faded in over its own blurred placeholder.
 *
 * Keyed by slug at the call site so navigating remounts this and resets the
 * loading state, rather than showing the previous photo under a stale flag.
 */
const Frame = ({
  photo,
  label,
  morphName,
}: {
  photo: Photo
  label: string
  morphName?: string
}) => {
  const [loaded, setLoaded] = useState(false)
  const ratio = `${photo.width} / ${photo.height}`

  return (
    <>
      {/*
       * The fitted size is computed in CSS rather than waiting on the image.
       * Left to the width and height attributes the box measured 0x0 until the
       * data arrived, which shoved the caption and the phone arrow row down by
       * over 100px mid-load. `min()` picks whichever of the width and height
       * limits binds first, so the box is exactly the photo's footprint from
       * the first frame, and the placeholder and rounding line up with it.
       *
       * Both limits come from the enclosing size container, which is the box
       * left over once the caption and controls have taken theirs. Measuring
       * the leftover space rather than assuming a share of the viewport is
       * what keeps this box the photo's exact shape: given a height it cannot
       * have, a flex item shrinks, its aspect ratio loses, and the photo ends
       * up letterboxed inside a wider rounded frame, which reads as a photo
       * with square corners.
       */}
      <div
        className="relative shrink-0 overflow-hidden rounded-xl shadow-2xl"
        style={{
          aspectRatio: ratio,
          width: `min(100cqw, calc(100cqh * ${photo.width} / ${photo.height}))`,
          viewTransitionName: morphName,
        }}
      >
        <img
          // A cached image can finish before React attaches onLoad, which would
          // leave it faded out for good, so the ref checks for that case too.
          ref={(node) => {
            if (node?.complete) setLoaded(true)
          }}
          onLoad={() => setLoaded(true)}
          src={photoSrc(photo, 1800)}
          srcSet={photoSrcSet(photo)}
          sizes="(min-width: 1024px) 80vw, 100vw"
          alt={photo.caption || label}
          width={photo.width}
          height={photo.height}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-400 ease-(--ease-out-soft)"
          style={{ opacity: loaded ? 1 : 0 }}
        />

        {/*
         * Blur-up, and nothing else. The placeholder cross-fades straight into
         * the photo in one move: a spinner on top of it read as three separate
         * loading stages rather than one, and the photo's own colours already
         * say that something is arriving.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center blur-md transition-opacity duration-400 ease-(--ease-out-soft)"
          style={{
            backgroundImage: `url(${photo.lqip})`,
            opacity: loaded ? 0 : 1,
          }}
        />
      </div>
    </>
  )
}

/**
 * A rail of thumbnails under the photo.
 *
 * The grid used to be the overview: you could see the shape of a collection
 * before picking something out of it. Opening straight into the viewer takes
 * that away mid-browse, so it comes back here, where it also answers "how
 * many more of these are there" without arrowing through to find out.
 *
 * Desktop and tablet only. A landscape phone is the one place with no height
 * to give, and it is exactly where the photo needs all of it.
 */
const Filmstrip = ({
  photos,
  index,
  onPick,
}: {
  photos: Photo[]
  index: number
  onPick: (index: number) => void
}) => {
  const current = useRef<HTMLButtonElement>(null)

  // Keep the current thumbnail in view when the photo changes by any other
  // means: arrow keys, a swipe, or the buttons either side.
  useEffect(() => {
    current.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [index])

  return (
    <div
      className="hidden w-full max-w-full shrink-0 justify-start gap-2 overflow-x-auto px-1 pb-1 sm:flex landscape:max-lg:hidden [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Centred as a group when the strip is short, scrollable when it is
          not, which `margin: auto` on the row does on its own. */}
      <span className="m-auto flex gap-2">
        {photos.map((photo, i) => {
          const active = i === index
          return (
            <button
              key={photo.slug}
              ref={active ? current : undefined}
              onClick={() => onPick(i)}
              aria-label={`Show photo ${i + 1}: ${photo.location || photo.date}`}
              aria-current={active ? 'true' : undefined}
              className="h-12 shrink-0 overflow-hidden rounded-sm bg-cover bg-center transition-[opacity,outline-color] duration-300 ease-(--ease-out-soft) hover:opacity-100"
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
                backgroundImage: `url(${photo.lqip})`,
                opacity: active ? 1 : 0.5,
                // An outline rather than a border or a ring, so selecting a
                // thumbnail cannot change its size and shuffle the strip.
                outline: '2px solid',
                outlineColor: active ? palette.sand : 'transparent',
                outlineOffset: '1px',
              }}
            >
              <img
                src={photoSrc(photo, 400)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          )
        })}
      </span>
    </div>
  )
}

/**
 * Full-screen viewer. The backdrop is the photo's own blur-up placeholder,
 * scaled up and heavily blurred, so the surround picks up the colour of
 * whatever you are looking at without a single extra byte over the network.
 *
 * Rendered through a portal on `document.body`. It has to escape the page: an
 * ancestor with a transform, filter or backdrop-filter becomes the containing
 * block for fixed positioning, which silently anchors this to that element
 * instead of the viewport and can drop the photo below the fold.
 */
export const Lightbox = ({
  photos,
  index,
  onClose,
  onNavigate,
  title,
  morphName,
}: LightboxProps) => {
  const photo = photos[index]
  const swipe = useRef<{ x: number; y: number } | null>(null)
  // Two flags, so the hint can animate both ways: it has to stay mounted
  // through its own exit.
  const [hintMounted, setHintMounted] = useState(false)
  const [hintShown, setHintShown] = useState(false)
  // The caption clears itself shortly after each photo settles, so the whole
  // frame is visible. Tapping the photo brings it back.
  const [captionShown, setCaptionShown] = useState(true)
  /*
   * The pill that answers a turned phone: either a thank you, or the offer
   * of fullscreen when the browser would not hand it over on its own.
   * Mounted and shown are separate so it can animate out as well as in.
   */
  const [notice, setNotice] = useState<'thanks' | 'offer' | null>(null)
  const [noticeShown, setNoticeShown] = useState(false)
  const answered = useRef(false)

  // Ask for landscape, and only nudge the reader if the browser said no. The
  // click that opened this is what authorises the request, so it has to happen
  // now rather than on a later interaction.
  /*
   * Nudge, rather than rotate for them.
   *
   * Locking the orientation requires fullscreen first, and fullscreen puts a
   * banner over the page announcing itself, which is a worse interruption than
   * the thing it was solving. So the reader is asked instead.
   */
  useEffect(() => {
    if (!matchMedia('(orientation: portrait) and (max-width: 640px)').matches)
      return
    const timers = [
      // A beat later, so the entrance transition has a state to move from.
      setTimeout(() => setHintShown(true), 60),
      setTimeout(() => setHintShown(false), 4500),
      setTimeout(() => setHintMounted(false), 5200),
    ]
    setHintMounted(true)
    return () => {
      for (const timer of timers) clearTimeout(timer)
    }
  }, [])

  /*
   * Turning the phone sideways is a request for the whole screen, so take it
   * literally and go fullscreen. Once per viewing, so rocking the phone back
   * and forth does not set it off repeatedly, and only on a screen small
   * enough for the ask to have been made in the first place.
   *
   * It is attempted silently rather than offered up front, because where it
   * works there is nothing to ask about: the browser chrome simply leaves.
   * But `requestFullscreen` needs transient user activation, and turning a
   * phone is not a user gesture, so the attempt often rejects even though
   * the API is there. That is what the offer is: a pill that supplies the
   * tap the spec wants, which is one gesture rather than the two that
   * asking first would have cost everybody.
   *
   * Nothing at all happens on an iPhone, which has no element fullscreen to
   * request. The safe-area insets and `viewport-fit=cover` already take that
   * case as far as the web can.
   */
  useEffect(() => {
    const landscape = matchMedia('(orientation: landscape)')
    const timers: ReturnType<typeof setTimeout>[] = []

    const flash = (kind: 'thanks' | 'offer') => {
      setNotice(kind)
      timers.push(setTimeout(() => setNoticeShown(true), 60))
      // The thank you is an acknowledgement and clears itself. The offer is
      // a control, so it waits to be used.
      if (kind !== 'thanks') return
      timers.push(setTimeout(() => setNoticeShown(false), 2200))
      timers.push(setTimeout(() => setNotice(null), 2800))
    }

    const onRotate = () => {
      if (!matchMedia('(max-width: 900px)').matches) return
      // Turned back upright: hand the chrome back rather than leaving them
      // stuck in a fullscreen they never asked for in this orientation.
      if (!landscape.matches) {
        exitFullscreen()
        return
      }
      if (answered.current) return
      answered.current = true
      const request = fullscreenRequest()
      if (!request) return
      request().then(
        () => flash('thanks'),
        () => flash('offer'),
      )
    }

    landscape.addEventListener('change', onRotate)
    return () => {
      landscape.removeEventListener('change', onRotate)
      for (const timer of timers) clearTimeout(timer)
    }
  }, [])

  // Leaving the viewer leaves fullscreen with it, however it was left.
  useEffect(() => exitFullscreen, [])

  // Re-armed per photo, so navigating shows the new location and then clears.
  useEffect(() => {
    setCaptionShown(true)
    const timer = setTimeout(() => setCaptionShown(false), 2800)
    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % photos.length)
      if (e.key === 'ArrowLeft')
        onNavigate((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    // Stop the shelf scrolling behind the viewer.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [index, photos.length, onClose, onNavigate])

  if (!photo) return null

  const label = photo.location || photo.date
  const go = (delta: number) =>
    onNavigate((index + delta + photos.length) % photos.length)

  /*
   * Swipe to move between photos. Horizontal intent is required, so a
   * vertical drag or a tap is not read as navigation, and the threshold is in
   * pixels rather than a fraction of the screen so it feels the same on any
   * device. Pointer events rather than touch events, so a trackpad drag works
   * the same way.
   */
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const from = swipe.current
    swipe.current = null
    if (!from) return
    const dx = e.clientX - from.x
    const dy = e.clientY - from.y
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
    go(dx < 0 ? 1 : -1)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-[lightbox-in_260ms_var(--ease-out-soft)_both] items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${label}, enlarged`}
      onClick={onClose}
    >
      {/* Colour-matched blurred surround */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${photo.lqip})`, opacity: 0.55 }}
      />
      {/* Blurs the shelf behind as well as tinting it, so the photo is the
          only thing in focus. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 backdrop-blur-xl"
        style={{ backgroundColor: '#0f1a20d4' }}
      />

      {/*
       * Only in portrait on a phone, and `landscape:hidden` means turning the
       * phone dismisses it with no JavaScript involved.
       */}
      {hintMounted && (
        <p
          className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] z-10 flex h-9 items-center gap-2 rounded-full px-3 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap uppercase backdrop-blur-md transition-[opacity,transform] duration-500 ease-(--ease-out-soft) sm:hidden landscape:hidden"
          style={{
            backgroundColor: '#00000073',
            color: palette.sand,
            opacity: hintShown ? 1 : 0,
            transform: hintShown ? 'none' : 'translateY(-10px)',
          }}
        >
          {/*
           * A phone that turns and holds, rather than a glyph spun through an
           * arbitrary angle and snapped back. The shape has to be obviously
           * portrait for the quarter turn to read as anything.
           */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 animate-[hint-rotate_2400ms_ease-in-out_infinite]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          >
            <rect x="5" y="1.5" width="6" height="13" rx="1.4" />
            <line x1="6.8" y1="12.6" x2="9.2" y2="12.6" strokeLinecap="round" />
          </svg>
          Psst, turn your phone sideways
        </p>
      )}

      {/*
       * Bottom right, opposite the close button, and clear of the centred
       * caption. Same pill as every other control here: matching radius,
       * padding, blur and type, so it reads as part of the set rather than a
       * notification pasted on top.
       *
       * Kept short deliberately. "I appreciate you" measured 150px, which
       * runs into a long caption at 568x320, the narrowest landscape phone
       * still worth supporting.
       *
       * A button in both cases, even for the thank you, so the two states
       * are one element and the offer does not have to be introduced with a
       * layout of its own. The thank you simply dismisses.
       */}
      {notice && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (notice === 'thanks') {
              setNoticeShown(false)
              return
            }
            // Inside a real click, so the activation the rotate event could
            // not supply is now there for the taking.
            const request = fullscreenRequest()
            void request?.().catch(() => {})
            setNoticeShown(false)
            setTimeout(() => setNotice(null), 600)
          }}
          className="absolute right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10 flex h-9 items-center gap-1.5 rounded-full px-3 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap uppercase backdrop-blur-md"
          style={{
            backgroundColor: '#00000073',
            color: palette.sand,
            opacity: noticeShown ? 1 : 0,
            transform: noticeShown ? 'none' : 'translateY(8px) scale(0.92)',
            transition:
              'opacity 260ms var(--ease-out-soft), transform 320ms var(--ease-out-soft)',
          }}
        >
          {notice === 'thanks' ? (
            <>
              <span
                aria-hidden="true"
                className="animate-[thanks-pop_600ms_var(--ease-out-soft)_both] text-[12px] leading-none"
                style={{ color: palette.moss }}
              >
                ✦
              </span>
              Thanks!
            </>
          ) : (
            <>
              {/* The four corner marks every fullscreen control uses. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
              </svg>
              Tap for fullscreen
            </>
          )}
        </button>
      )}

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-10 flex h-9 items-center rounded-full px-3 text-sm backdrop-blur-md"
        style={{ backgroundColor: '#00000059', color: palette.sand }}
      >
        Close
      </button>

      {photos.length > 1 && (
        <>
          {(
            [
              [
                'Previous',
                -1,
                'left-[max(0.25rem,env(safe-area-inset-left))] sm:left-[max(1rem,env(safe-area-inset-left))]',
                '‹',
              ],
              [
                'Next',
                1,
                'right-[max(0.25rem,env(safe-area-inset-right))] sm:right-[max(1rem,env(safe-area-inset-right))]',
                '›',
              ],
            ] as const
          ).map(([name, delta, position, glyph]) => (
            <button
              key={name}
              aria-label={name}
              onClick={(e) => {
                e.stopPropagation()
                go(delta)
              }}
              className={`absolute z-10 hidden h-11 w-11 items-center justify-center rounded-full pb-1 text-2xl backdrop-blur-md sm:flex ${position}`}
              style={{ backgroundColor: '#00000059', color: palette.sand }}
            >
              {glyph}
            </button>
          ))}
        </>
      )}

      {/*
       * Generous margins on every side rather than a full-bleed image: the
       * photo reads as a framed object against the blurred ground, and the
       * controls in the corners stay clear of it.
       */}
      <figure
        /*
         * Full height, with the margins expressed as padding: the photo then
         * gets whatever the padding, the gaps, the caption and the controls
         * leave, whatever those happen to measure. A landscape phone has
         * almost no height to spare, so there the padding and gaps shrink.
         * Bounded to small screens, since a desktop is landscape too and wants
         * the breathing room.
         */
        className="relative z-0 flex h-full w-full max-w-[min(1400px,96vw)] flex-col items-center gap-4 px-2 py-16 sm:px-14 sm:py-20 lg:px-20 landscape:max-lg:gap-2 landscape:max-lg:px-3 landscape:max-lg:py-2"
        onClick={(e) => {
          e.stopPropagation()
          setCaptionShown((shown) => !shown)
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        // A drag that leaves the figure should not be left half-tracked.
        onPointerCancel={() => (swipe.current = null)}
        style={{ touchAction: 'pan-y' }}
      >
        {/*
         * Size container, so the photo can be sized in `cqh` against the
         * height that is genuinely free. `container-type: size` needs a
         * definite height, which `flex-1` on a full-height column supplies.
         */}
        <div className="[container-type:size] flex min-h-0 w-full flex-1 items-center justify-center">
          <Frame
            key={photo.slug}
            photo={photo}
            label={label}
            morphName={morphName}
          />
        </div>
        {/*
         * Under the photo, never over it, at every size. A landscape phone has
         * the least height to spare, so this is where an overlay was most
         * tempting, but the row costs only a couple of percent of the photo's
         * height and keeps the frame unobstructed.
         */}
        <figcaption
          className="text-center transition-opacity duration-700 ease-(--ease-out-soft)"
          style={{ opacity: captionShown ? 1 : 0 }}
        >
          <span
            className="font-mono text-[0.7rem] tracking-[0.2em] uppercase"
            style={{ color: palette.stoneText }}
          >
            {label}
          </span>
          {/* One line, not two: a landscape phone gives up real photo
              height for every row under the frame. */}
          {title && (
            <span
              className="mt-1 block font-mono text-[0.65rem] tracking-[0.2em] uppercase"
              style={{ color: `${palette.sand}73` }}
            >
              {title} · {index + 1} / {photos.length}
            </span>
          )}
        </figcaption>

        {photos.length > 1 && (
          <Filmstrip photos={photos} index={index} onPick={onNavigate} />
        )}

        {/*
         * Phone controls sit under the photo rather than over it. At this
         * width an overlaid arrow covers a real part of the image and lands
         * where a thumb already is, so it both hides the subject and competes
         * with the swipe.
         */}
        {photos.length > 1 && (
          <div className="flex items-center gap-3 sm:hidden">
            {(
              [
                ['Previous photo', -1, '‹'],
                ['Next photo', 1, '›'],
              ] as const
            ).map(([name, delta, glyph]) => (
              <button
                key={name}
                aria-label={name}
                onClick={(e) => {
                  e.stopPropagation()
                  go(delta)
                }}
                className="flex h-11 w-16 items-center justify-center rounded-full pb-1 text-2xl backdrop-blur-md"
                style={{ backgroundColor: '#ffffff1a', color: palette.sand }}
              >
                {glyph}
              </button>
            ))}
          </div>
        )}
      </figure>

      <style>{`
        @keyframes lightbox-in{from{opacity:0}to{opacity:1}}
        /* Hold portrait, turn, hold landscape, turn back. The holds are what
           make it read as an instruction instead of a spin. */
        @keyframes hint-rotate{0%,18%{transform:rotate(0)}42%,66%{transform:rotate(-90deg)}90%,100%{transform:rotate(0)}}
        @keyframes thanks-pop{0%{transform:scale(0) rotate(-60deg)}60%{transform:scale(1.35) rotate(8deg)}100%{transform:scale(1) rotate(0)}}
      `}</style>
    </div>,
    document.body,
  )
}
