package services

import (
	"PiluVitu/pr-live-folder-back/infra/tools"
	"context"

	"github.com/google/go-github/v64/github"
	"golang.org/x/oauth2"
)

type PrCard struct {
	Repo            string
	Title           string
	ContributorType string
	AuthorLogin     string
	CratedAt        string
	UpdatedAt       string
	Reviewers       []string
	PrURL           string
	IsDraft         bool
	Status          *github.CombinedStatus
}

func GetGithubClient(githubToken string, ctx context.Context) *github.Client {
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: githubToken},
	)
	tc := oauth2.NewClient(ctx, ts)

	client := github.NewClient(tc)

	return client
}

func GetAuthenticatedUser(client *github.Client, ctx context.Context) (user string, err error) {
	userObj, _, err := client.Users.Get(ctx, "")
	if err != nil {
		return *userObj.Login, err
	}
	return *userObj.Login, nil
}

func ListAllUserRepos(client *github.Client, ctx context.Context) (repositories []*github.Repository, err error) {
	// optPadrao =

	opt := &github.RepositoryListByAuthenticatedUserOptions{
		Direction: "desc",
		Sort:      "created",
		// Affiliation: "owner,collaborator,organization_member",
		ListOptions: github.ListOptions{
			Page:    1,
			PerPage: 100,
		},
	}

	for {

		repos, res, err := client.Repositories.ListByAuthenticatedUser(ctx, opt)
		if err != nil {
			return nil, err
		}

		repositories = append(repositories, repos...)

		if res.NextPage == 0 {
			break
		}

		opt.Page = res.NextPage

	}

	return repositories, nil
}

func ListAllThirdUserRepos(client *github.Client, ctx context.Context) (repositories []*github.Repository, err error) {
	opt := &github.RepositoryListByUserOptions{
		Type:      "all",
		Direction: "desc",
		Sort:      "created",

		ListOptions: github.ListOptions{
			Page:    1,
			PerPage: 100,
		},
	}

	repositories, _, err = client.Repositories.ListByUser(ctx, "PiluVitu", opt)
	if err != nil {
		return nil, err
	}

	return repositories, nil
}

func GetPrStatus(client *github.Client, ctx context.Context, owner string, repo string, sha string) (*github.CombinedStatus, error) {
	status, _, err := client.Repositories.GetCombinedStatus(ctx, owner, repo, sha, nil)
	if err != nil {

		print("DEU MERDA NA HORA DE PEGAR OS STATUS")
		return nil, err
	}

	return status, nil
}

func GetGithubPullRequest(client *github.Client, ctx context.Context, owner string, repo string, user string) ([]PrCard, error) {
	pr, _, err := client.PullRequests.List(ctx, owner, repo, nil)
	if err != nil {
		return nil, err
	}

	var prCards []PrCard

	for _, pr := range pr {

		var reviewers []string

		reviwersCount := pr.RequestedReviewers

		for _, reviwer := range reviwersCount {
			reviewers = append(reviewers, *reviwer.Login)
		}

		if tools.Contains(reviewers, user) {
			status, err := GetPrStatus(client, ctx, owner, repo, *pr.Head.SHA)
			if err != nil {

				print("DEU MERDA NA HORA DE PEGAR OS STATUS")
				return nil, err
			}

			prCard := PrCard{
				Repo:            repo,
				Title:           *pr.Title,
				ContributorType: *pr.AuthorAssociation,
				AuthorLogin:     *pr.User.Login,
				CratedAt:        pr.CreatedAt.String(),
				UpdatedAt:       pr.UpdatedAt.String(),
				Reviewers:       reviewers,
				PrURL:           *pr.HTMLURL,
				IsDraft:         *pr.Draft,
				Status:          status,
			}

			prCards = append(prCards, prCard)
		}
	}

	return prCards, nil
}
