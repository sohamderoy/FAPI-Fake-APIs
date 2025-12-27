# FAPI

A developer tool for creating and simulating fake APIs (FAPIs) locally for rapid and independent frontend development.

> [!IMPORTANT]
>
> **FAPI is 100% Local & Private.** FAPI data never leaves your machine unless you explicitly choose to export and share it.

## Use Cases FAPI Addresses

- **Parallel Development**: Enable frontend and backend teams to work simultaneously with agreed-upon API contracts
- **Rapid API Response Prototyping**: Experiment with API response structures before actual implementation
- **Error & Edge Case Testing**: Test error handling and edge cases handling by simulating various API failure scenarios, status codes, responses and response delays
- **Load Testing UI**: Test how your frontend handles slow APIs by adding realistic network delays
- **Third-party API Simulation**: Mock external APIs (payment gateways, social media APIs) to avoid costs and rate limits during development
- **Demo Applications**: Quickly create working UI prototypes and demos without production backend dependencies
- **Learning & Education**: Developers learning frontend development can practice API integration without setting up complex backends
- **Offline Development**: Work on projects during travel or in environments without internet connectivity

## Key Features

- **Quick Setup**: Build custom API endpoints instantly through an intuitive UI
- **Zero Configuration**: File-based storage with no database required
- **100% Local & Private**: All data stays on your machine, works completely offline
- **Persistent Storage**: All endpoints and configurations are automatically saved and persist across browser sessions and server restarts
- **Customizable Responses**: Configure custom HTTP status codes (200, 404, 500 etc) and JSON responses (support for other formats coming soon)
- **Realistic Simulation**: Add custom response delays to simulate network latency
- **Flexible HTTP Methods**: Support for GET, POST, PUT, DELETE requests (support for other methods coming soon)
- **Full Endpoint Control**: Create, edit, and delete endpoints on the fly
- **Multiple Instances**: Run FAPI on different ports with completely isolated data for each instance
- **Import/Export**: Share API configurations with your team or back up your endpoints as JSON files
- **Project Names**: Organize and identify different FAPI instances with custom project names
- **Developer-Friendly**: Interactive UI for seamless endpoint management

## Installation & Usage

**Prerequisites:** Node.js (v20.9.0 or higher) must be installed. [Download Node.js](https://nodejs.org/)

Run FAPI directly with `npx`:

```bash
npx start-fapi
# Starts FAPI on default port 3000
```

## Running Multiple FAPI Instances

You can run multiple instances of FAPI on different ports to support multiple projects. Each instance maintains completely isolated and independent data - endpoints, configurations, and responses created in one instance will not affect or appear in another instance:

```bash
# Terminal 1: Starts FAPI on default port 3000 to support project A
npx start-fapi

# Terminal 2: Starts FAPI on port 3001 to support project B
npx start-fapi --port 3001

# Terminal 3: Starts FAPI on port 5501 to support project C
npx start-fapi --port 5501
```

## How It Works

1. Run the command `npx start-fapi`
2. Open your browser at `http://localhost:3000`
3. Create fake API endpoints through the UI
4. Your endpoints are immediately available at `http://localhost:3000/api/fapi/<your-endpoint-name>`

## Examples

### Basic Endpoint Creation

If you create an endpoint named `/users`, it will be accessible at:

```
http://localhost:3000/api/fapi/users
```

### Complete Workflow Example

Let's create a simple user management API:

### Successful Response Examples

#### 1. Get All Users (GET)

Create an endpoint:

- **Endpoint Path**: `/users`
- **HTTP Method**: GET
- **Response**:

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

- **Status Code**: 200
- **Delay**: 2000ms (optional - simulates network latency)

#### 2. Get Single User (GET)

Create an endpoint:

- **Endpoint Path**: `/users/1`
- **HTTP Method**: GET
- **Response**:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

- **Status Code**: 200

#### 3. Create User (POST)

Create an endpoint:

- **Endpoint Path**: `/users`
- **HTTP Method**: POST
- **Response**:

```json
{
  "message": "User created successfully",
  "user": {
    "id": 3,
    "name": "New User",
    "email": "newuser@example.com"
  }
}
```

- **Status Code**: 200

#### 4. Update User (PUT)

Create an endpoint:

- **Endpoint Path**: `/users/1`
- **HTTP Method**: PUT
- **Response**:

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com"
  }
}
```

- **Status Code**: 200

#### 5. Delete User (DELETE)

Create an endpoint:

- **Endpoint Path**: `/users/1`
- **HTTP Method**: DELETE
- **Response**:

```json
{
  "message": "User deleted successfully"
}
```

- **Status Code**: 200

### Error Response Examples

#### 1. 500 Internal Server Error

Create an endpoint:

- **Endpoint Path**: `/users/999`
- **HTTP Method**: GET
- **Response**:

```json
{
  "error": "Internal Server Error"
}
```

- **Status Code**: 500
- **Delay**: 5000ms (simulate slow failing request - to test how UI behaves while waiting for API response)

### Using FAPI Endpoints in Your Frontend Code

#### With Fetch API

```javascript
// Get all users
fetch("http://localhost:3000/api/fapi/users")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// Create a new user
fetch("http://localhost:3000/api/fapi/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Alice Johnson",
    email: "alice@example.com",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Update a user
fetch("http://localhost:3000/api/fapi/users/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe Updated",
    email: "john.updated@example.com",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Delete a user
fetch("http://localhost:3000/api/fapi/users/1", {
  method: "DELETE",
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

#### With Axios

```javascript
import axios from "axios";

const API_BASE = "http://localhost:3000/api/fapi";

// Get all users
const getUsers = async () => {
  const response = await axios.get(`${API_BASE}/users`);
  return response.data;
};

// Create a new user
const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE}/users`, userData);
  return response.data;
};

// Update a user
const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_BASE}/users/${id}`, userData);
  return response.data;
};

// Delete a user
const deleteUser = async (id) => {
  const response = await axios.delete(`${API_BASE}/users/${id}`);
  return response.data;
};
```

#### With React Query

```javascript
import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE = "http://localhost:3000/api/fapi";

// Fetch users
function UsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/users`);
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}

// Create user mutation
function CreateUserForm() {
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      return response.json();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name: "New User", email: "new@example.com" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Create User</button>
      {mutation.isLoading && <p>Creating user...</p>}
      {mutation.isSuccess && <p>User created!</p>}
    </form>
  );
}
```

## Requirements

- Node.js >= 20.9.0

## License

MIT
