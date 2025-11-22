package functions

import (
	"context"
	"log/slog"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func HelloWorld(
	ctx context.Context,
	input inngestgo.Input[map[string]interface{}],
) (any, error) {
	slog.InfoContext(ctx, "HelloWorld function started", "event", input.Event)

	// Extract the name from the event data
	name := "world"
	if input.Event.Data != nil {
		if val, ok := input.Event.Data["name"]; ok {
			if n, ok := val.(string); ok {
				name = n
			}
		}
	}

	slog.InfoContext(ctx, "Processing event", "name", name)

	_, err := step.Run(ctx, "hello-step", func(ctx context.Context) (string, error) {
		msg := "Hello, " + name + "!"
		slog.InfoContext(ctx, msg)
		return msg, nil
	})

	if err != nil {
		slog.ErrorContext(ctx, "Error in step", "error", err)
		return nil, err
	}

	slog.InfoContext(ctx, "HelloWorld function completed")
	return map[string]string{
		"status":  "success",
		"message": "Hello, " + name + "!",
	}, nil
}
