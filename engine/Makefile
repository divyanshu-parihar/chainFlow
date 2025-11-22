# MakeFile for building the engine for the chainFlow

build: 
	go build -o ../build/engine main.go

run: 
	../build/engine

dev:
	go build -o ../build/engine main.go
	INNGEST_DEV=1 INNGEST_BASE_URL=http://localhost:8288 INNGEST_SIGNING_KEY='1234' INNGEST_EVENT_KEY='abcd' ../build/engine

