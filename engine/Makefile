# MakeFile for building the engine for the chainFlow

build: 
	go build -o ../build/engine main.go

run: 
	../build/engine

dev:
	go build -o ../build/engine main.go
	INNGEST_DEV=true ../build/engine

