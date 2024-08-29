package config

import "github.com/spf13/viper"

var env *Envconfig

type Envconfig struct {
	GITHUB_TOKEN string `mapstructure:"GITHUB_TOKEN"`
	GITHUB_ORG   string `mapstructure: "GITHUB_ORG"`
	GITHUB_REPO  string `mapstructure: "GITHUB_REPO"`
	PORT         string `mapstructure: "PORT"`
}

func GetEnvConfig() *Envconfig {
	return env
}

func LoadEnv(path string) (*Envconfig, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("env")
	viper.AddConfigPath(path)
	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	if err := viper.Unmarshal(&env); err != nil {
		panic(err)
	}

	return env, nil
}
