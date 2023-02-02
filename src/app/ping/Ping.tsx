'use client'
import { useState, useEffect } from 'react'
import socket from './socket'

export default function Ping({ data: hosts, children }: IPing) {
  // const [hosts, setHosts] = useState(data)
  const [statusHost, setStatusHost] = useState<IStatus>({})

  useEffect(() => {
    for (const ip of hosts) {
      socket.on(ip.hostName, data => {
        setStatusHost(prevData => ({ ...prevData, [ip.hostName]: data }))
      })
    }
    return () => {
      socket.removeAllListeners()
    }
  }, [hosts])
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
          const updateAt = new Date(statusHost[host.hostName]?.updatedAt)
          return (
            <tr key={host.id}>
              <td>{host.hostName}</td>
              <td>{host.user}</td>
              <td>{host.divisi}</td>
              <td>{statusHost[host.hostName]?.status || 'unknown status'}</td>
              <td>{updateAt instanceof Date && !isNaN(updateAt.valueOf()) ? updateAt.toLocaleString() : 'unknown date'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

interface IPing {
  data: { id: number; hostName: string; user: string; divisi: string }[]
  children?: React.ReactNode
}

interface IStatus {
  [key: string]: { status: string; updatedAt: Date }
}