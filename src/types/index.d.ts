type Pair<K = string> = { code: number; status: K }
const pairs = (<T>(p: readonly Pair<T>[]) => p)([
  { code: 200, status: 'OK' },
  { code: 201, status: 'Created' },
  { code: 204, status: 'No Content' },
  { code: 400, status: 'Bad Request' },
  { code: 401, status: 'Unauthorized' },
  { code: 403, status: 'Forbidden' },
  { code: 404, status: 'Not Found' },
  { code: 409, status: 'Conflict' }
] as const)
type Code = (typeof pairs)[number]['code']
type Status = (typeof pairs)[number]['status']

export interface ResBE<T> {
  code: Code
  status: Status
  data?: T
  error?: unknown
}

export type SetRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
