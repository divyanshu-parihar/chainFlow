package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/divyanshu-parihar/chainFlow/functions"
	"github.com/inngest/inngestgo"
)

func main() {
	// Set up structured logging
	handler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelDebug,
	})
	logger := slog.New(handler)
	slog.SetDefault(logger)

	ctx := context.Background()
	slog.InfoContext(ctx, "Starting Inngest client...")

	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "core",
	})
	if err != nil {
		slog.ErrorContext(ctx, "Failed to create Inngest client", "error", err)
		panic(err)
	}

	slog.InfoContext(ctx, "Registering function...")
	fn, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID:   "hello-world",
			Name: "Hello World",
		},
		inngestgo.EventTrigger("hello.world", nil),
		functions.HelloWorld,
	)
	if err != nil {
		slog.ErrorContext(ctx, "Failed to create function", "error", err)
		panic(err)
	}

	slog.InfoContext(ctx, "Function registered",
		"id", fn.ID,
		"name", fn.Name,
		"trigger", fn.Trigger,
	)

	slog.InfoContext(ctx, "Starting HTTP server on :8080...")
	if err := http.ListenAndServe(":8080", client.Serve()); err != nil {
		slog.ErrorContext(ctx, "HTTP server error", "error", err)
		panic(err)
	}
}
