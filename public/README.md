# Public Folder Structure

This folder contains all static files served by the backend.

## Directory Structure

```
public/
├── images/          # Jewelry images
├── videos/          # Jewelry videos
└── README.md        # This file
```

## File Access URLs

- Images: `https://catalogue-api.crystovajewels.com/images/filename.jpg`
- Videos: `https://catalogue-api.crystovajewels.com/videos/filename.mp4`
- General public files: `https://catalogue-api.crystovajewels.com/public/path/to/file`

## File Upload Rules

- **Images**: Only image files (jpg, png, gif, etc.) are allowed
- **Videos**: Only video files (mp4, avi, mov, etc.) are allowed
- **File Size**: Maximum 50MB per file
- **Naming**: Files are automatically renamed with timestamp and random number for uniqueness

## API Endpoints

- `POST /api/jewelry` - Upload jewelry with image or video
- `PUT /api/jewelry/:id` - Update jewelry with new image or video

## Example Usage

```javascript
// Upload form data
const formData = new FormData();
formData.append('name', 'Gold Ring');
formData.append('price', '500');
formData.append('image', imageFile); // or formData.append('video', videoFile);

fetch('/api/jewelry', {
  method: 'POST',
  body: formData
});
```
