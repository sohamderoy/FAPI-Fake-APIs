# FAPI (Fake API)

A developer tool for creating and simulating fake APIs (FAPIs) locally for rapid and independent frontend development.

## Features

- Create mock API endpoints dynamically
- Support for following HTTP methods (GET, POST, PUT, DELETE)
- Custom response delays
- JSON response configuration
- Multiple instance support (run on different ports)
- Interactive UI for managing FAPI endpoints

## Installation & Usage

Run FAPI directly with npx (no installation required):

```bash
# Start on default port 3000
npx create-fapi

# Start on custom port
npx create-fapi --port 4000
npx create-fapi -p 5000
```

## Running Multiple Instances

You can run multiple instances of FAPI on different ports to maintain separate API configurations:

```bash
# Terminal 1
npx create-fapi --port 3000

# Terminal 2
npx create-fapi --port 3001

# Terminal 3
npx create-fapi --port 3002
```

Each instance will have its own storage in the `.fapi-storage` folder.

## How It Works

1. Run the command `npx create-fapi`
2. Open your browser at `http://localhost:3000`
3. Create fake API endpoints through the UI
4. Your endpoints are immediately available at `http://localhost:3000/api/fapi/your-endpoint`
5. All configurations are stored locally in `.fapi-storage`

## Example

If you create an endpoint named `/users`, it will be accessible at:

```
http://localhost:3000/api/fapi/users
```

## Use Cases

- Frontend development without waiting for backend teams to complete building APIs
- Testing frontend applications by simulating API behaviors with various responses, response status codes and delays
- Creating demo applications with mock data
- API prototyping and experimentation
- Learning and teaching REST API concepts

## Requirements

- Node.js >= 18.0.0

## License

MIT
