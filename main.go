package main

import (
	"PiluVitu/pr-live-folder-back/infra/config"
	"PiluVitu/pr-live-folder-back/internal/web"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

func main() {
	envLocation := os.Getenv("ENV_LOCATION")
	envVariable, err := config.LoadEnv(envLocation)
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Get("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("To funfandooooo filhoooooooo")
	})
	r.Get("/auth/github", web.GithubAuthHandler)
	r.Get("/github/pullrequests", web.ListAllPrsToReview)

	fmt.Printf("A APIZINHA ESTÁ FUNFANDO NA\nhttp://localhost:%s\n", envVariable.PORT)
	log.Fatal(http.ListenAndServe(":"+envVariable.PORT, r))
}
