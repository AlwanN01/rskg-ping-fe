'use client'
import { useRouter } from 'next/navigation'
import { usePing } from './hooks/usePing'

export default function Ping({ data, children }: IPing) {
  const { hosts, statusHost } = usePing(data)
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
          const updateAt = (host.updatedAt && new Date(host.updatedAt).toLocaleDateString()) || 'unknown date'
          return (
            <tr key={host.id}>
              <td>{host.hostName}</td>
              <td>{host.user}</td>
              <td>{host.divisi}</td>
              <td>{host.status || 'unknown status'}</td>
              <td>{updateAt}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

type IPing = {
  data: { id: number; hostName: string; user: string; divisi: string }[]
  children?: React.ReactNode
}

type IStatus = {
  [key: string]: { status: string; updatedAt: Date }
}

export const PingRefresh = () => {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>Refresh Data</button>
}
