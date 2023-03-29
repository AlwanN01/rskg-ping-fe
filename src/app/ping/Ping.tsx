'use client'
import { useRouter } from 'next/navigation'
import { useListenPing, usePing } from './hooks/usePing'
import { type DataHost } from './page'
import { Container, Pagination, Table, NumberInput, Group, ActionIcon, type NumberInputHandlers, Button, Text } from '@mantine/core'
import { useRef } from 'react'

type IPing = { data: DataHost[]; children?: React.ReactNode }
// usePing.setState({ orderBy: 'user' })
export default function Ping({ data }: IPing) {
  const { hosts, totalPage } = useListenPing(data)
  const setLimit = usePing.setLimit()
  const activePage = usePing.activePage()
  const setActivePage = usePing.setActivePage()
  const handlers = useRef<NumberInputHandlers>()
  const renderTime = useRef(0)
  renderTime.current++
  console.log(`rendered ${renderTime.current} time`)

  return (
    <Container size={'xl'}>
      <Group>
        <ActionIcon size={35} variant='default' onClick={() => handlers.current!.decrement()}>
          -
        </ActionIcon>
        <NumberInput
          hideControls
          handlersRef={handlers}
          min={1}
          max={data.length}
          defaultValue={data.length > 10 ? 10 : data.length}
          onChange={setLimit}
          styles={{ input: { width: 80, textAlign: 'center' } }}
        />
        <ActionIcon size={35} variant='default' onClick={() => handlers.current!.increment()}>
          +
        </ActionIcon>
      </Group>
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
      <Pagination size={'lg'} page={activePage} onChange={setActivePage} total={totalPage} />
    </Container>
  )
}

export const PingRefresh = () => {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>Refresh Data</button>
}
