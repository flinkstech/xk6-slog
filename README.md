# xk6-slog

This is a [k6](https://go.k6.io/k6) extension using the
[xk6](https://github.com/grafana/xk6) system.

| :exclamation: This is a sort of hack to bypass the builtin logger of k6 because I was too lazy to figure that out. USE AT YOUR OWN RISK! |
|------|

## Example

You can replace `console.log()` for `slog.log()` and you'll be able to use structured logs.

NB: **UNTESTED** with Loki and K6 Cloud. Might not work since this is bypassing Logrus.

Supports the environment variable `K6_LOG_FORMAT`.

```javascript
// script.js
import exec from 'k6/execution';
import slog from 'k6/x/slog';

export const options = {
  vus: 1,
  duration: '1s',
  tags: {
    testid: 12345,
  },
};

export default function() {
  slog.setPersistentField("testid", exec.test.options.tags.testid);

  let complexObject = {
    a: {
      b: "c"
    }
  }
  slog.info("this is an info log", "object", complexObject)
}
```

## Build

To build a `k6` binary with this extension, first ensure you have the prerequisites:

- [Go toolchain](https://go101.org/article/go-toolchain.html)
- Git

Then:

1. Install `xk6`:
  ```shell
  $ go install go.k6.io/xk6/cmd/xk6@latest
  ```

2. Build the binary:
  ```shell
  $ xk6 build --with github.com/flinkstech/xk6-slog@latest
  ```

Result output:

```
$ K6_LOG_FORMAT=json ./k6 run script.js

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: script.js
        output: -

     scenarios: (100.00%) 1 scenario, 2 max VUs, 31s max duration (incl. graceful stop):
              * default: 2 looping VUs for 1s (gracefulStop: 30s)

{"time":"2024-05-15T14:20:19.912684-04:00","level":"INFO","msg":"reponse from test.k6.io","testid":"12345","response":{"url":"https://test.k6.io/"}}
{"time":"2024-05-15T14:20:19.912684-04:00","level":"INFO","msg":"reponse from test.k6.io","testid":"12345","response":{"url":"https://test.k6.io/"}}
{"time":"2024-05-15T14:20:19.954419-04:00","level":"INFO","msg":"reponse from test.k6.io","testid":"12345","response":{"url":"https://test.k6.io/"}}
```

## Possible improvements

I couldn't figure it out with the time I had, but it would be nice to be able to call `SetPersistentField()` in the `setup()` stage function.

However, what I noticed is that the logger between `setup()` and the `default function()` are not shared.

This would avoid `SetPersistentField()` being called for every VU/iteration.

I quickly mesured with and without it
```
# With SetPersistentField() in default function()
avg=1.78ms min=3.66µs med=14.7µs max=63.63ms p(90)=6.21ms p(95)=8.35ms

# Without
avg=1.61ms min=2.62µs med=9.66µs max=62.37ms p(90)=5.97ms p(95)=8.3ms
```