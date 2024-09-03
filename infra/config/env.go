package config

import "github.com/spf13/viper"

var env *Envconfig

type Envconfig struct {
	GITHUB_TOKEN         string `mapstructure:"GITHUB_TOKEN"`
	GITHUB_CLIENT_ID     string `mapstructure:"GITHUB_CLIENT_ID"`
	GITHUB_CLIENT_SECRET string `mapstructure:"GITHUB_CLIENT_SECRET"`
	GITHUB_REDIRECT_URL  string `mapstructure:"GITHUB_REDIRECT_URL"`
	PORT                 string `mapstructure:"PORT"`
}

func GetEnvConfig() *Envconfig {
	return env
}

func LoadEnv(path string) (*Envconfig, error) {
	viper.SetConfigName("app_config")
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
