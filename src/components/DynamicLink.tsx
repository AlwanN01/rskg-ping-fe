'use client'

import type { SetRequired } from '@/types'
import { useRouter } from 'next/navigation'
import { forwardRef } from 'react'
type FRProps = SetRequired<Omit2<React.HTMLProps<HTMLAnchorElement>, 'ref'>, 'href'>
const DynamicLink = forwardRef<HTMLAnchorElement, FRProps>(({ href, children, ...props }, ref) => {
  const router = useRouter()

  return (
    <a
      {...props}
      ref={ref}
      href={href}
      onClick={e => {
        e.preventDefault()
        router.push(href!)
      }}>
      {children}
    </a>
  )
})

DynamicLink.displayName = 'Dynamic Link'
export default DynamicLink
