import Link from 'next/link'
import DynamicLink from '@/components/DynamicLink'
const PingLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <header className='p-5'>
      <nav className='flex gap-6'>
        <Link href='/'>Home</Link>
        <DynamicLink href='/ping'>ping</DynamicLink>
        <Link href='/ping/add'>Add Host</Link>
      </nav>
    </header>
    {children}
  </>
)

export default PingLayout
