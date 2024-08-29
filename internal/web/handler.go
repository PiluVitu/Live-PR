package web

import (
	"PiluVitu/pr-live-folder-back/infra/config"
	"PiluVitu/pr-live-folder-back/internal/services"
	"context"
	"encoding/json"
	"log"
	"net/http"
)

// TODO: Criar rota q lista os prs do usuario
// TODO: Criar rota de login social pra gerar token q vai ser usado
// TODO: Ver como passar o token pela rota
// TODO: Se precisar usar turso pra bd
// TODO: Deploy da api vai ser no Railway

type RepoOption struct {
	Owner    string
	RepoName string
}

type PrCards struct {
	UserLogin string
	Data      []services.PrCard
}

func ListAllPrsToReview(w http.ResponseWriter, r *http.Request) {
	repoOptions := []RepoOption{
		{Owner: "devhatt", RepoName: "octopost"},
		{Owner: "devhatt", RepoName: "octopost-backend"},
		{Owner: "devhatt", RepoName: "pet-dex-backend"},
		{Owner: "devhatt", RepoName: "pet-dex-frontend"},
		{Owner: "devhatt", RepoName: "devhatt-lp"},
		{Owner: "devhatt", RepoName: "mangale"},
		{Owner: "devhatt", RepoName: "workflows"},
		{Owner: "devhatt", RepoName: "infra"},
		{Owner: "devhatt", RepoName: "hatbot-discord"},
	}
	envVariable, err := config.LoadEnv(".")
	if err != nil {
		panic(err)
	}
	// Substitua por seu token pessoal do GitHub
	githubToken := envVariable.GITHUB_TOKEN
	if githubToken == "" {
		log.Fatal("Por favor, defina a variável de ambiente GITHUB_TOKEN")
	}

	ctx := context.Background()

	client := services.GetGithubClient(githubToken, ctx)

	var prCards PrCards

	user, err := services.GetAuthenticatedUser(client, ctx)
	if err != nil {
		log.Fatalf("Erro ao buscar user %v", err)
	}
	prCards.UserLogin = user

	for _, repoOptions := range repoOptions {
		prsToReview, err := services.GetGithubPullRequest(client, ctx, repoOptions.Owner, repoOptions.RepoName, user)
		if err != nil {
			log.Fatalf("Erro ao bsucar PullRequests:\n %v", err)
		}

		prCards.Data = append(prCards.Data, prsToReview...)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(prCards)
}
