'use client'
import { useRouter } from 'next/navigation'
import { usePing } from './hooks/usePing'
import { type DataHost } from './page'
import { Container, Pagination, Table, NumberInput, Group } from '@mantine/core'

type IPing = { data: DataHost[]; children?: React.ReactNode }
export default function Ping({ data }: IPing) {
  const { hosts, limit, setLimit, activePage, setActivePage, totalPage } = usePing(data)
  return (
    <Container size={'xl'}>
      <Table>
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
      </Table>
      <Group>
        <NumberInput type='number' radius={'sm'} w={60} min={1} max={Math.ceil(data.length / limit)} value={10} onChange={setLimit} />
        <Pagination page={activePage} onChange={setActivePage} total={totalPage} />
      </Group>
    </Container>
  )
}

export const PingRefresh = () => {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>Refresh Data</button>
}
