export type Data = {
  Repo: string
  Title: string
  ContributorType: string
  AuthorLogin: string
  CratedAt: string
  UpdatedAt: string
  Reviewers: string[]
  PrURL: string
  IsDraft: boolean
}

export type Error = {
  Type: string
  Messege: string
}

export type User = {
  UserLogin: string
  Data: Data[]
  Error: Error
}
