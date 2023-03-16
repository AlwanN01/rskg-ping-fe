'use client'
import { useRouter } from 'next/navigation'
import { usePing } from './hooks/usePing'
import { type DataHost } from './page'

type IPing = { data: DataHost[]; children?: React.ReactNode }
export default function Ping({ data }: IPing) {
  const { hosts } = usePing(data)
  return (
    <table>
      <thead>
        <tr>
          <th>HostName</th>
          <th>User</th>
          <th>Divisi</th>
          <th>Status</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {hosts.map(host => {
          const updateAt = host.updatedAt && new Date(host.updatedAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })
          return (
            <tr key={host.id}>
              <td>{host.hostName}</td>
              <td>{host.user}</td>
              <td>{host.divisi}</td>
              <td>{host.status || 'unknown status'}</td>
              <td>{updateAt || 'unknown date'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export const PingRefresh = () => {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>Refresh Data</button>
}
