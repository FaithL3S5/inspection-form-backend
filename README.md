# Car Inspection Form - Backend

## Overview

This Node.js backend application provides the server-side functionality for the Car Inspection Form system. It handles image uploads, storage, retrieval, and deletion using a simple Express server with file system storage.

## Features

- Multiple image upload handling
- File type validation (jpg, jpeg, png)
- File size limitation (5MB per file)
- Static file serving
- File deletion capability
- Random inspirational quote fetching

## Tech Stack

- Node.js
- Express.js
- Multer (for file upload handling)
- File System (fs) for storage

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn (v1.x or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/FaithL3S5/inspection-form-backend.git
   cd inspection-form-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or 
   yarn install
   ```

## Configuration

The server runs on port 3001 by default. If you need to change this, modify the `port` variable in `index.js`.

## Running the Application

Start the development server:

```bash
node index.js
# or if you have nodemon installed
nodemon index.js
```

The server will be available at [http://localhost:3001](http://localhost:3001).

## API Endpoints

### Upload Multiple Files

```
POST /upload-multiple
```

Accepts form data with multiple files under the 'files' field. Returns information about uploaded files.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: form data with 'files' field containing images

**Response:**
```json
{
  "files": [
    {
      "name": "car_front.jpg",
      "size": 123456,
      "type": "image/jpeg",
      "url": "/uploads/1645278965412-1234567890-car_front.jpg",
      "lastModified": 1645278965412
    },
    // More files...
  ]
}
```

### Get All Images

```
GET /images
```

Returns a list of all images in the uploads directory.

**Response:**
```json
{
  "files": [
    {
      "name": "car_front.jpg",
      "size": 123456,
      "type": "jpeg",
      "url": "/uploads/1645278965412-1234567890-car_front.jpg",
      "lastModified": 1645278965412,
      "serverFilename": "1645278965412-1234567890-car_front.jpg"
    },
    // More files...
  ]
}
```

### Delete an Image

```
DELETE /images/:filename
```

Deletes a specific image by its server filename.

**Parameters:**
- filename: The server-generated filename (e.g., "1645278965412-1234567890-car_front.jpg")

**Response:**
```json
{
  "message": "File deleted successfully",
  "filename": "1645278965412-1234567890-car_front.jpg"
}
```

### Get Random Quote

```
GET /quote
```

Fetches a random inspirational quote from ZenQuotes API.

**Response:**
```json
[
  {
    "q": "An inspirational quote text",
    "a": "Author Name",
    "h": "An-inspirational-quote-text-Author-Name"
  }
]
```

## File Storage

Files are stored in the `uploads/` directory at the root of the project. This directory is created automatically if it doesn't exist when the server starts.

## Limitations

- Simple file system storage (not suitable for production with high traffic)
- No user authentication/authorization
- No database integration for metadata storage
- No cloud storage integration for scalability
- Limited error logging
- No automated testing implementation

## Error Handling

The server implements basic error handling for:
- File size limits (max 5MB per file)
- Invalid file types (only jpg, jpeg, png allowed)
- Missing files during upload
- File not found during deletion
- General server errors

## Production Considerations

For a production environment, consider:
1. Implementing proper user authentication
2. Using a database for file metadata storage
3. Using cloud storage (AWS S3, Google Cloud Storage, etc.)
4. Adding comprehensive logging
5. Implementing automated testing
6. Setting up proper CORS configuration
7. Using HTTPS instead of HTTP

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built using Express.js and Multer
- Quote API provided by [ZenQuotes.io](https://zenquotes.io/)
