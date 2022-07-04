# paste-service

Simple pastebin.

## Configuration

Create a configuration file (`/config/production.json`)

Example:
```json
{
	"auth": {
		"keys": ["3692ebdc-fa90-4319-a8ff-1de848e85344"]
	},
	"http": {
		"port": 3000,
		"addr": "0.0.0.0"
	},
	"mongo": {
		"url": "mongodb://mongo/paste_service"
	},
	"publicUrl": {
		"protocol": "https",
		"host": "example.com",
		"urlPrefix": "/p/"
	}
}
```

## Api

### Authentication

Keys can be configured in the config (`auth.keys[]`).

If one or more keys is configured. Requests to add pasts has to have an authorization header (`Authorization: Bearer <key>`).

### Create link

`POST /api/v1/pastes`

```json
{
    "title": "Hello World js",
    "content": "function helloWorld() {\n\treturn\"Hello World\";\n}",
    "language": "javascript"
}
```