podman build -t signmaster-auth .
podman tag signmaster-auth asia-southeast2-docker.pkg.dev/capstone-project-c242-ps363/backend/signmaster-auth
podman push asia-southeast2-docker.pkg.dev/capstone-project-c242-ps363/backend/signmaster-auth
gcloud run deploy signmaster-auth --image=asia-southeast2-docker.pkg.dev/capstone-project-c242-ps363/backend/signmaster-auth --platform=managed --region=asia-southeast2 --allow-unauthenticated
