# Service Auth

`HOST:https://signmaster-auth-kji5w4ybbq-et.a.run.app`

## Register

### Request

```http
GET /auth/register
{
  "username": string,
  "email": string,
  "password": string,
  "confirmPassword": string
}
```

### Response

```http
{
  "message": string
  "error": boolean
}

```

## Login

### Request

```http
GET /auth/login
{
  "email": string,
  "password": string,
}
```

### Response

```http
{
  "error": boolean
  "message": string
  "loginResult": {
    "userId": string,
    "name": string,
    "email": string,
    "isSubscribe": boolean,
    "token": string
  }
}
```
