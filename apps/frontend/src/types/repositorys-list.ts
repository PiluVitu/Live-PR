export interface Owner {
  login: string
  id: number
  node_id: string
  avatar_url: string
  html_url: string
  gravatar_id: string
  type: string
  site_admin: boolean
  url: string
  events_url: string
  following_url: string
  followers_url: string
  gists_url: string
  organizations_url: string
  received_events_url: string
  repos_url: string
  starred_url: string
  subscriptions_url: string
}

export interface Permissions {
  admin: boolean
  maintain: boolean
  pull: boolean
  push: boolean
  triage: boolean
}

export interface License {
  key: string
  name: string
  url?: string
  spdx_id: string
}

export interface Repository {
  id: number
  node_id: string
  owner: Owner
  name: string
  full_name: string
  description?: string
  default_branch: string
  created_at: string
  pushed_at: string
  updated_at: string
  html_url: string
  clone_url: string
  git_url: string
  ssh_url: string
  svn_url: string
  fork: boolean
  forks_count: number
  open_issues_count: number
  open_issues: number
  stargazers_count: number
  watchers_count: number
  watchers: number
  size: number
  permissions: Permissions
  allow_forking: boolean
  web_commit_signoff_required: boolean
  archived: boolean
  disabled: boolean
  private: boolean
  has_issues: boolean
  has_wiki: boolean
  has_pages: boolean
  has_projects: boolean
  has_downloads: boolean
  has_discussions: boolean
  is_template: boolean
  url: string
  archive_url: string
  assignees_url: string
  blobs_url: string
  branches_url: string
  collaborators_url: string
  comments_url: string
  commits_url: string
  compare_url: string
  contents_url: string
  contributors_url: string
  deployments_url: string
  downloads_url: string
  events_url: string
  forks_url: string
  git_commits_url: string
  git_refs_url: string
  git_tags_url: string
  hooks_url: string
  issue_comment_url: string
  issue_events_url: string
  issues_url: string
  keys_url: string
  labels_url: string
  languages_url: string
  merges_url: string
  milestones_url: string
  notifications_url: string
  pulls_url: string
  releases_url: string
  stargazers_url: string
  statuses_url: string
  subscribers_url: string
  subscription_url: string
  tags_url: string
  trees_url: string
  teams_url: string
  visibility: string
  language?: string
  homepage?: string
  license?: License
  topics?: string[]
}
