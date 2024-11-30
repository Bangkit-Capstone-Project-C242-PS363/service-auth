echo "Cant access without token"
curl localhost:3000/auth/restriction

echo -e "\n\nMust be error if a field is missing"
curl localhost:3000/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "", "email": "", "password": "", "confirmPassword": ""}'

echo -e "\n\nMust be registered succesfully"
curl localhost:3000/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "test", "email": "test@test.com", "password": "123456789", "confirmPassword": "123456789"}'

echo -e "\n\nMust be failed login with wrong password"
curl localhost:3000/auth/login \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"email": "test@test.com", "password": "1234567890"}'

echo -e "\n\nMust be able to login successfully"
output=$(curl localhost:3000/auth/login \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"email": "test@test.com", "password": "123456789"}' 2>/dev/null)
echo $output

#auth with bearer token
token=$(echo $output | jq -r '.token')
echo -e "\n\nMust be able to access with token"
curl localhost:3000/auth/restriction \
  -H "Authorization: Bearer $token"
