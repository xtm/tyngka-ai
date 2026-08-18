import json
import urllib.request

url="http://localhost:11434/api/generate"

data = {
"model":"llama3.2",
"prompt":input("Ask Llama: "),
"stream":False
}

request = urllib.request.Request(url,data=json.dumps(data).encode("utf-8"),headers = {"Content-Type":"application/jon"}
)

with urllib.request.urlopen(request) as response:result = json.loads(response.read().decode("utf-8"))

print(result["response"])
