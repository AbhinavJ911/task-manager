# Cloud & Remote Hosting

## What is Cloud Deployment?
While Docker and Minikube allow you to containerize and isolate your application code locally, the "Cloud" is required to finally host the application on physical infrastructure accessible by public domain names on the internet natively 24/7 without requiring your personal laptop to remain powered on.

## Hosting Methodologies 

### Platform as a Service (PaaS)
PaaS tools like **Render**, **Vercel**, or **Heroku** act as a highly managed middle-man. You simply hand them your code (e.g., pointing Render to your GitHub repository), and they figure out how to build and host your Web App and API. This involves almost zero server maintenance but is generally less customizable.

### Infrastructure as a Service (IaaS)
IaaS providers like **AWS (Amazon Web Services)**, **Microsoft Azure**, and **Google Cloud Platform (GCP)** provide you with raw virtual hardware (virtual servers, subnets, and load balancers). You have maximum control over architecture (like setting up custom AWS Auto Scaling Groups using our `aws-cfn-autoscaling.yml` template) but must manually configure networking and operating systems yourself.

## CI/CD integration
When migrating to the cloud natively, remember not to push your unencrypted `frontend/.env` or `backend/.env` files to git. Those strings must be safely injected into your Cloud provider's "Environment Variables" dashboard to ensure production safety!
