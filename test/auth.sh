HOST=https://signmaster-auth-kji5w4ybbq-et.a.run.app
echo "Cant access without token"
curl $HOST/auth/restriction 2>/dev/null | jq

echo -e "\n\nMust be error if a field is missing"
curl $HOST/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "", "email": "", "password": "", "confirmPassword": ""}' 2>/dev/null | jq

echo -e "\n\nMust be registered succesfully"
curl $HOST/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "testa", "email": "atest@test.com", "password": "123456789", "confirmPassword": "123456789"}' 2>/dev/null | jq

echo -e "\n\nMust be failed login with wrong password"
curl $HOST/auth/login \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"email": "test@test.com", "password": "1234567890"}' 2>/dev/null | jq

echo -e "\n\nMust be able to login successfully"
output=$(curl $HOST/auth/login \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"email": "test@test.com", "password": "123456789"}' 2>/dev/null)
echo $output | jq

#auth with bearer token
token=$(echo $output | jq -r .loginResult.token)
echo -e "\n\nMust be able to access with token"
curl $HOST/auth/restriction \
  -H "Authorization: Bearer $token" 2>/dev/null | jq

curl $HOST/auth/subscribe \
  -H "Authorization: Bearer $token " 2>/dev/null | jq

# curl $HOST/auth/unsubscribe \
#   -H "Authorization: Bearer $token " 2>/dev/null | jq
