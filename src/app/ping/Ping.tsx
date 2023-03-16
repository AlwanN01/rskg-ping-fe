'use client'
import { useRouter } from 'next/navigation'
import { type Host, usePing } from './hooks/usePing'

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
          const updateAt = host.updatedAt && new Date(host.updatedAt).toLocaleDateString()
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

type IPing = {
  data: Host[]
  children?: React.ReactNode
}
export const PingRefresh = () => {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>Refresh Data</button>
}
