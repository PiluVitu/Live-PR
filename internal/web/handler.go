package web

import (
	"PiluVitu/pr-live-folder-back/infra/config"
	"PiluVitu/pr-live-folder-back/internal/services"
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

// TODO: Se precisar usar turso pra bd
// TODO: Deploy da api vai ser no Railway

type RepoOption struct {
	Owner    string
	RepoName string
}

type Error struct {
	Type    string
	Message string
}

type PrCards struct {
	UserLogin string
	Data      []services.PrCard
	Error     Error
}

var prCards PrCards

func GithubAuthHandler(w http.ResponseWriter, r *http.Request) {
	envVariable, err := config.LoadEnv(".")
	if err != nil {
		panic(err)
	}

	githubOauthConfig := &oauth2.Config{
		ClientID:     envVariable.GITHUB_CLIENT_ID,
		ClientSecret: envVariable.GITHUB_CLIENT_SECRET,
		// RedirectURL:  envVariable.GITHUB_REDIRECT_URL,
		Scopes:   []string{"profile", "email"},
		Endpoint: github.Endpoint,
	}

	code := r.URL.Query().Get("code")

	token, err := githubOauthConfig.Exchange(context.TODO(), code)
	if err != nil {
		prCards.Error.Type = "token"
		prCards.Error.Message = err.Error()
		log.Printf("Error exchanging code: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(prCards)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(token.AccessToken)
}

func ListAllUserRepositorys(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	GITHUB_TOKEN := r.URL.Query().Get("code")
	if GITHUB_TOKEN == "" {
		prCards.Error.Type = "token"
		prCards.Error.Message = errors.New("missing authToken").Error()
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(prCards)
		log.Println(prCards.Error)
		return
	}

	client := services.GetGithubClient(GITHUB_TOKEN, ctx)
	repositorys, err := services.ListAllUserRepos(client, ctx)
	if err != nil {
		prCards.Error.Type = "pullRequest"
		prCards.Error.Message = err.Error()
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(prCards)
		log.Println(prCards.Error)
		return
	}

	prCards.Error.Type = ""
	prCards.Error.Message = ""
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(repositorys)
}

func ListAllPrsToReview(w http.ResponseWriter, r *http.Request) {
	GITHUB_TOKEN := r.URL.Query().Get("code")

	if GITHUB_TOKEN == "" {
		prCards.Error.Type = "token"
		prCards.Error.Message = errors.New("missing authToken").Error()
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(prCards)
		log.Println(prCards.Error)
		return
	}

	var repoOptions []RepoOption

	var repoStringsJson []string

	if err := json.NewDecoder(r.Body).Decode(&repoStringsJson); err != nil {
		prCards.Error.Type = "body-request"
		prCards.Error.Message = err.Error()
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(prCards)
		log.Println(prCards.Error)
		return
	}

	for _, repoStringsJson := range repoStringsJson {

		repo := strings.Split(repoStringsJson, "/")

		repoOptions = append(repoOptions, RepoOption{
			Owner:    repo[0],
			RepoName: repo[1],
		})

	}

	ctx := context.Background()

	client := services.GetGithubClient(GITHUB_TOKEN, ctx)

	user, err := services.GetAuthenticatedUser(client, ctx)
	if err != nil {
		prCards.Error.Type = "user"
		prCards.Error.Message = err.Error()
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(prCards)
		log.Println(prCards.Error)
		return
	}
	prCards.UserLogin = user

	prCards.Data = nil
	for _, repoOptions := range repoOptions {
		prsToReview, err := services.GetGithubPullRequest(client, ctx, repoOptions.Owner, repoOptions.RepoName, user)
		if err != nil {
			prCards.Error.Type = "pull request"
			prCards.Error.Message = err.Error()
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(prCards)
			log.Println(prCards.Error)
			return
		}

		prCards.Data = append(prCards.Data, prsToReview...)
	}

	if prCards.Data == nil {
		prCards.Error.Type = "missing reviews"
		prCards.Error.Message = errors.New("pull request are missing reviews").Error()
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(prCards)
		log.Println(prCards.Error)
		return
	}
	prCards.Error.Type = ""
	prCards.Error.Message = ""
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(prCards)
}
