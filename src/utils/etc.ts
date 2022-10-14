export type PartialNull<T> = {
  [P in keyof T]: T[P] | null
}
export type PartialNullUndefinded<T> = {
  [P in keyof T]?: T[P] | null
}
