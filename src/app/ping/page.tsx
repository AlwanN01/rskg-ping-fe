import Ping from './Ping'
import type { ResBE } from '@/types'
export interface DataHost {
  id: number
  hostName: string
  user: string
  divisi: string
}
const getData = async (): Promise<ResBE<DataHost[]>> => {
  const res = await fetch('http://localhost:3001/host/?allAtributes=true', { cache: 'no-store' })
  return res.json()
}
export default async function Page() {
  const { data, error } = await getData()
  if (!data) throw error
  return (
    <>
      {/* <PingRefresh /> */}
      <Ping data={data} />
    </>
  )
}
