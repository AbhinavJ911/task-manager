# Kubernetes Quick Start

Here are the absolute minimum commands required to start the cluster and see the table view of your running services.

### 1. Start the Server & Apply Configuration
Run this to boot up the cluster and deploy the application:
```powershell
minikube start
kubectl apply -f k8s/
```

### 2. View the Services (The Table View)
Run this command to see the 3-column table showing the status of your containers:
```powershell
kubectl get pods
```

*(If you want to see the advanced graphical table, run `minikube dashboard`)*

### 3. Expose to Browser (Run both in ONE terminal)
Run these universally compatible commands to start both processes natively in the background of your current Command Prompt:
```cmd
start /B kubectl port-forward svc/backend-service 5000:5000
start /B kubectl port-forward svc/frontend-service 3000:80
```
*(They will run silently in the background. Press Enter if you don't see your prompt return).*

### Clean Up (Stop everything)
```powershell
minikube stop
```
