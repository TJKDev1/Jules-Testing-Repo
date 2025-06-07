const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const port = process.env.PORT || 3000;
const videosDir = path.join(__dirname, 'videos');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to get the list of videos
app.get('/api/videos', (req, res) => {
  fs.readdir(videosDir, (err, files) => {
    if (err) {
      console.error('Error reading videos directory:', err);
      return res.status(500).json({ error: 'Failed to retrieve videos.' });
    }
    const videoFiles = files.filter(file => file !== '.gitkeep');
    res.json(videoFiles);
  });
});

// API endpoint to stream a single video
app.get('/video/:filename', (req, res) => {
  const videoPath = path.join(videosDir, req.params.filename);

  fs.stat(videoPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send('Video not found');
      }
      console.error('Error stating video file:', err);
      return res.status(500).send('Error accessing video');
    }

    const fileSize = stats.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  });
});

// Socket.IO connection handling
let currentPlaybackState = { videoId: null, status: 'paused', time: 0, lastUpdatedBy: null };

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('initialState', currentPlaybackState);

  socket.on('play', (data) => {
    currentPlaybackState.status = 'playing';
    if (data && data.time !== undefined) currentPlaybackState.time = data.time;
    if (data && data.videoId) currentPlaybackState.videoId = data.videoId;
    currentPlaybackState.lastUpdatedBy = socket.id;
    socket.broadcast.emit('syncPlay', { time: currentPlaybackState.time, videoId: currentPlaybackState.videoId });
    // console.log('play:', currentPlaybackState);
  });

  socket.on('pause', (data) => {
    currentPlaybackState.status = 'paused';
    if (data && data.time !== undefined) currentPlaybackState.time = data.time;
    if (data && data.videoId) currentPlaybackState.videoId = data.videoId; // Ensure videoId is updated
    currentPlaybackState.lastUpdatedBy = socket.id;
    socket.broadcast.emit('syncPause', { time: currentPlaybackState.time, videoId: currentPlaybackState.videoId });
    // console.log('pause:', currentPlaybackState);
  });

  socket.on('seek', (data) => {
    if (data && data.time !== undefined) currentPlaybackState.time = data.time;
    if (data && data.videoId) currentPlaybackState.videoId = data.videoId;
    currentPlaybackState.lastUpdatedBy = socket.id;
    socket.broadcast.emit('syncSeek', { time: currentPlaybackState.time, videoId: currentPlaybackState.videoId });
    // console.log('seek:', currentPlaybackState);
  });

  socket.on('changeVideo', (data) => {
    if (data && data.videoId) {
      currentPlaybackState.videoId = data.videoId;
      currentPlaybackState.status = 'paused';
      currentPlaybackState.time = 0;
      currentPlaybackState.lastUpdatedBy = socket.id;
      io.emit('loadNewVideo', { videoId: currentPlaybackState.videoId }); // Emit to all clients
      // console.log('changeVideo:', currentPlaybackState);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
