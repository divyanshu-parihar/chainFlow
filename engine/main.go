package main

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/divyanshu-parihar/chainFlow/functions"
	"github.com/inngest/inngestgo"
)

func main() {
	ctx := context.Background()
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "core",
	})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID:   "hello-world",
			Name: "Hello World",
		},
		inngestgo.EventTrigger("api/hello.world", nil),
		functions.HelloWorld,
	)
	if err != nil {
		panic(err)
	}
	slog.InfoContext(ctx, "Engine Started...")
	http.ListenAndServe(":8080", client.Serve())
}
