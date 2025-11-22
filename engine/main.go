package main

import (
	"context"
	"log/slog"
	"net/http"
	"net/url"
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

	// Get configuration from environment variables with defaults for local dev
	baseURL := os.Getenv("INNGEST_BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8288"
	}
	signingKey := os.Getenv("INNGEST_SIGNING_KEY")
	if signingKey == "" {
		signingKey = "1234" // Default dev signing key
	}
	dev := os.Getenv("INNGEST_DEV") == "1" || os.Getenv("INNGEST_DEV") == "true"

	// For self-hosted Inngest, the register URL should point to the API base URL
	// The handler will append /fn/register automatically
	registerURL := baseURL + "/api/v1"
	devPtr := &dev

	// Set the function URL so Inngest server knows where to invoke the function
	functionURL, err := url.Parse("http://localhost:8080")
	if err != nil {
		slog.ErrorContext(ctx, "Failed to parse function URL", "error", err)
		panic(err)
	}

	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID:       "core",
		RegisterURL: &registerURL,
		SigningKey:  &signingKey,
		Dev:         devPtr,
		URL:         functionURL,
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

	slog.InfoContext(ctx, "Function created",
		"id", fn.ID,
		"name", fn.Name,
		"trigger", fn.Trigger,
	)

	slog.InfoContext(ctx, "Configuration",
		"baseURL", baseURL,
		"registerURL", registerURL,
		"functionURL", functionURL.String(),
		"dev", dev,
		"appID", "core",
	)

	slog.InfoContext(ctx, "Starting HTTP server on :8080...")
	slog.InfoContext(ctx, "Server will handle:")
	slog.InfoContext(ctx, "  - Function invocations: POST http://localhost:8080")
	slog.InfoContext(ctx, "  - Function registration: PUT http://localhost:8080 (from Inngest server)")
	slog.InfoContext(ctx, "  - Function inspection: GET http://localhost:8080")
	slog.InfoContext(ctx, "")
	slog.InfoContext(ctx, "Waiting for Inngest server to discover and invoke functions...")
	slog.InfoContext(ctx, "Make sure your Inngest dev server is configured to discover functions at http://localhost:8080")

	if err := http.ListenAndServe(":8080", client.Serve()); err != nil {
		slog.ErrorContext(ctx, "HTTP server error", "error", err)
		panic(err)
	}
}
