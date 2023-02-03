import Ping from './Ping'

const getData = async () => {
  const res = await fetch('http://localhost:3001/host/?allAtributes=true')
  return res.json()
}
export default async function Page() {
  const { data } = await getData()
  return (
    <>
      {/* <PingRefresh /> */}
      <Ping data={data} />
    </>
  )
}
