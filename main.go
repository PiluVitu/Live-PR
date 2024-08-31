package main

import (
	"PiluVitu/pr-live-folder-back/infra/config"
	"PiluVitu/pr-live-folder-back/internal/web"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi"
)

func main() {
	envVariable, err := config.LoadEnv(".")
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()

	r.Get("/", web.ListAllPrsToReview)
	r.Get("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("To funfandooooo filhoooooooo")
	})

	fmt.Printf("A APIZINHA ESTÁ FUNFANDO NA\nhttp://localhost:%s", envVariable.PORT)
	log.Fatal(http.ListenAndServe(":"+envVariable.PORT, r))
}
