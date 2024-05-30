import slog from 'k6/x/slog';

export const options = {
  vus: 10,
  duration: '1s',
};

export default function() {
  // setPersistentField will add a log field in all future logs
  slog.setPersistentField("testid", "12345");

  let complexObject = { a: { b: "c" } }
  slog.log("this is an info log (via log())", "object", complexObject)
  slog.warn("this is a debug log")
  slog.info("this is an info log")
  slog.warn("this is a warn log")
  slog.error("this is an error log")
}

// When `K6_LOG_FORMAT=json` is set, returns
// {"time":"2024-05-15T14:44:20.175905-04:00","level":"INFO","msg":"this is an info log (via log())","testid":"12345","object":{"a":{"b":"c"}}}
// {"time":"2024-05-15T14:44:20.175909-04:00","level":"WARN","msg":"this is a debug log","testid":"12345"}
// {"time":"2024-05-15T14:44:20.175911-04:00","level":"INFO","msg":"this is an info log","testid":"12345"}
// {"time":"2024-05-15T14:44:20.175914-04:00","level":"WARN","msg":"this is a warn log","testid":"12345"}
// {"time":"2024-05-15T14:44:20.175916-04:00","level":"ERROR","msg":"this is an error log","testid":"12345"}

// Otherwise
// time=2024-05-15T14:45:29.929-04:00 level=INFO msg="this is an info log (via log())" testid=12345 object=map[a:map[b:c]]
// time=2024-05-15T14:45:29.930-04:00 level=WARN msg="this is a debug log" testid=12345
// time=2024-05-15T14:45:29.930-04:00 level=INFO msg="this is an info log" testid=12345
// time=2024-05-15T14:45:29.930-04:00 level=WARN msg="this is a warn log" testid=12345
// time=2024-05-15T14:45:29.930-04:00 level=ERROR msg="this is an error log" testid=12345