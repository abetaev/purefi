if (Test-Path cov_profile) {
  Remove-Item cov_profile -Recurse
} 

deno test --coverage=cov_profile --unstable
deno coverage --unstable cov_profile
