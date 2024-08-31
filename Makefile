
# Nome do executável
TARGET = meu_programa

# Diretório dos arquivos fonte
SRC_DIR = ./cmd/$(TARGET)

# Diretório onde o binário será salvo
BIN_DIR = ./bin

# Arquivo de saída
BIN = $(BIN_DIR)/$(TARGET)

# Regra principal: construir o projeto
all: build

# Construir o executável
build:
	@echo "==> Building..."
	@go build -o $(BIN) $(SRC_DIR)

## Rodar o programa
run: build
	@echo "==> Running..."
	@$(BIN)

## Rodar o programa em dev
dev:
	@echo "==> Running dev..."
	@go run main.go

# Rodar testes
test:
	@echo "==> Running tests..."
	@go test ./...

# Limpar arquivos binários
clean:
	@echo "==> Cleaning..."
	@rm -f $(BIN)

# Rodar linter (exemplo com golangci-lint)
lint:
	@echo "==> Linting..."
	@golangci-lint run

# Formatar código
fmt:
	@echo "==> Formatting..."
	@go fmt ./...

# Verificar formatação
vet:
	@echo "==> Vetting..."
	@go vet ./...

# Atualizar dependências
deps:
	@echo "==> Updating dependencies..."
	@go mod tidy
