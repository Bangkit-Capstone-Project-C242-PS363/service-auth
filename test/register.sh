echo "Must be error if a field is missing"
curl localhost:3000/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "", "email": "", "password": "", "confirmPassword": ""}'
echo ""

echo "Must be success"
curl localhost:3000/auth/register \
  -X POST \
  -H "Content-Type: application/json " \
  -d '{"username": "test", "email": "test@test.com", "password": "123456789", "confirmPassword": "123456789"}'
