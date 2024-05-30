package slog

import (
	goslog "log/slog"
	"os"
	"strings"
	"sync"

	"go.k6.io/k6/js/modules"
)

func init() {
	var s Slog

	logFormat := os.Getenv("K6_LOG_FORMAT")
	if strings.EqualFold(logFormat, "json") {
		s.logger = goslog.New(goslog.NewJSONHandler(os.Stdout, nil))
	} else {
		s.logger = goslog.New(goslog.NewTextHandler(os.Stdout, nil))
	}

	modules.Register("k6/x/slog", &s)
}

type Slog struct {
	logger      *goslog.Logger
	extraFields sync.Map
}

// SetPersistentField adds a field to the logs that stay for all the logs
// Useful to add test run id or tagging metadata
func (s *Slog) SetPersistentField(fieldName string, value string) {
	if _, ok := s.extraFields.Load(fieldName); !ok {
		s.logger = s.logger.With(fieldName, value)
		s.extraFields.Store(fieldName, struct{}{})
	}
}

// Log creates an info log
func (s *Slog) Log(msg string, args ...any) {
	s.logger.Info(msg, args...)
}

// Debug creates a debug log
func (s *Slog) Debug(msg string, args ...any) {
	s.logger.Debug(msg, args...)
}

// Info creates an info log
func (s *Slog) Info(msg string, args ...any) {
	s.logger.Info(msg, args...)
}

// Warn creates a warn log
func (s *Slog) Warn(msg string, args ...any) {
	s.logger.Warn(msg, args...)
}

// Error creates an error log
func (s *Slog) Error(msg string, args ...any) {
	s.logger.Error(msg, args...)
}
