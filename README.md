# Aqua-Runtime-Tester
App that allows to experiment with the Aqua Container Runtime controls.


kubectl create deployment aqua-runtime-tester --image=mulan04/aqua-runtime-tester


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


Server is running on http://aqua-runtime-tester.default.svc.cluster.local:3000


kubectl logs -f $(kubectl get pods | grep aqua-runtime-tester | awk '{print $1}') 