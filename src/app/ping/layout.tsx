import Link from 'next/link'

const PingLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <header className='p-5'>
      <nav className='flex gap-6'>
        <Link href='/'>Home</Link>
        <Link href='/ping'>ping</Link>
        <Link href='/ping/add'>Add Host</Link>
      </nav>
    </header>
    {children}
  </>
)

export default PingLayout
