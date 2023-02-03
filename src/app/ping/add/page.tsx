'use client'
import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core'
import { useForm, isNotEmpty } from '@mantine/form'
import { useState } from 'react'
export default function Page() {
  const [errMessage, setErrMessage] = useState('')
  const [issues, setIssues] = useState<any[]>([])
  const form = useForm<InitValue>({
    validate: {
      hostName: isNotEmpty('nama Host/IP wajib diisi'),
      divisi: isNotEmpty('nama Divisi wajib diisi'),
      user: isNotEmpty('nama User wajib diisi')
    }
  })
  const handleSubmit = async (values: InitValue) => {
    console.log(values)

    try {
      const res = await fetch('http://localhost:3001/host', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      const data = await res.json()
      if (data?.code >= 400) setErrMessage(data?.errors?.message), setIssues(data?.errors?.issues)
      else setErrMessage('success'), setIssues([])
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box sx={{ maxWidth: 300 }} mx='auto'>
      <h1>{errMessage}</h1>
      <div>
        {issues.map((data, index) => (
          <li key={index}>{`${data?.path} : ${data?.message}`}</li>
        ))}
      </div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput withAsterisk label='Host Name' placeholder='Host Name..' {...form.getInputProps('hostName')} />
        <TextInput withAsterisk label='User' placeholder='User Name..' {...form.getInputProps('user')} />
        <TextInput withAsterisk label='Divisi' placeholder='Divisi Name..' {...form.getInputProps('divisi')} />

        <Group position='right' mt='md'>
          <Button type='submit'>Submit</Button>
        </Group>
      </form>
    </Box>
  )
}

interface InitValue {
  hostName: string
  user: string
  divisi: string
}
