# Aqua-Runtime-Tester
App that allows to experiment with the Aqua Container Runtime policy controls.<br>
Ammend the commands.json with your bash commands accordingly.


In Docker do
```[bash]
docker run --rm --name aqua-runtime-tester -p 3000:3000 mulan04/aqua-runtime-tester:latest
```
which will expose the UI to http://localhost:3000/

To deploy in K8s do
```[bash]
kubectl create deployment aqua-runtime-tester --image=mulan04/aqua-runtime-tester
```

To exose the deployment
```[bash]
kubectl expose deployment aqua-runtime-tester --type=LoadBalancer --port=3000
```

or
```[bash]
cat << EOF | kubectl apply -f -
kind: Service
apiVersion: v1
metadata:
  name: aqua-runtime-tester
spec:
  selector:
    app: aqua-runtime-tester
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
EOF
```

If you use minikube then the Aqua-Runtime-Tester UI is on 
```[bash]
minikube service list --namespace default --output='json' | jq -r '.[] | select(.Name == "aqua-runtime-tester").URLs[0]'
```

To get the output of the executed commands
```[bash]
kubectl logs -f $(kubectl get pods | grep aqua-runtime-tester | awk '{print $1}') 
```
