# Service Auth

## Register
```http
GET https://signmaster-auth-kji5w4ybbq-et.a.run.app/auth/register
{
  username: string,
  email: string,
  password: string,
  confirmPassword: string
}
```

## Login
```http
GET https://signmaster-auth-kji5w4ybbq-et.a.run.app/auth/login
{
  email: string,
  password: string,
}
```
