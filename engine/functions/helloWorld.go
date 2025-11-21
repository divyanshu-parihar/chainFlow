package functions

import (
	"context"
	"log/slog"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func HelloWorld(
	ctx context.Context,
	input inngestgo.Input[AccountCreatedEvent],
) (any, error) {
	result, err := step.Run(ctx, "hello-world", func(ctx context.Context) (bool, error) {
		slog.InfoContext(ctx, "hello world")
		return true, nil
	})
	if err != nil {
		return nil, err
	}
	slog.InfoContext(ctx, "step result", slog.Bool("result", result))
	return nil, nil
}

type AccountCreatedEvent inngestgo.GenericEvent[AccountCreatedEventData]
type AccountCreatedEventData struct {
}
