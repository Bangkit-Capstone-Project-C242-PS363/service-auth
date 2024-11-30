echo "Must be error if a field is missing"
curl localhost:3000/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "", "email": "", "password": "", "confirmPassword": ""}'

echo -e "\n\nMust be registered succesfully"
curl localhost:3000/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "test", "email": "test@test.com", "password": "123456789", "confirmPassword": "123456789"}'

echo -e "\n\nMust be able to login successfully"
curl localhost:3000/auth/login \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"email": "test@test.com", "password": "123456789"}'
