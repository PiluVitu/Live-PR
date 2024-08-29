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

			prCard := PrCard{
				Repo:            repo,
				Title:           *pr.Title,
				ContributorType: *pr.AuthorAssociation,
				AuthorLogin:     *pr.User.Login,
				CratedAt:        pr.CreatedAt.String(),
				UpdatedAt:       pr.UpdatedAt.String(),
				Reviewers:       reviewers,
				PrURL:           *pr.HTMLURL,
			}

			prCards = append(prCards, prCard)
		}
	}

	return prCards, nil
}
